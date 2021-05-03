const passport = require("passport");
const express = require("express");
const jwt = require("jsonwebtoken");

const tokens = {};
const router = express.Router();

router.get("/status", (req, res, next) => {
  res.status(200).json({ status: "ok" });
});

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    res.status(200).json({ message: "signup successful" });
  }
);

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        return next(new Error("Internal error occured"));
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const body = {
          _id: user._id,
          email: user.email,
        };

        const token = jwt.sign({ user: body }, "top_secret", {
          expiresIn: 300,
        });
        const refreshToken = jwt.sign({ user: body }, "top_secret_refresh", {
          expiresIn: 86400,
        });

        res.cookie("jwt", token);
        res.cookie("refreshJwt", refreshToken);

        tokens[refreshToken] = {
          token,
          refreshToken,
          email: user.email,
          _id: user._id,
        };

        return res.status(200).json({ token, refreshToken });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.post("/token", (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken in tokens) {
    const body = {
      email: tokens[refreshToken].email,
      _id: tokens[refreshToken]._id,
    };
    const token = jwt.sign({ user: body }, "top_secret", { expiresIn: 300 });
    res.cookie("jwt", token);
    tokens[refreshToken].token = token;
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

router.post("/logout", (req, res) => {
  if (req.cookies) {
    const refreshToken = req.cookies["refreshJwt"];
    if (refreshToken in tokens) delete tokens[refreshToken];
    res.clearCookie("refreshJwt");
    res.clearCookie("jwt");
  }

  res.status(200).json({ message: "logged out" });
});

module.exports = router;
