const express = require("express");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const UserModel = require("../models/userModel");

const router = express.Router();

router.post(
  "/submit-score",
  asyncMiddleware(async (req, res, next) => {
    const { email } = req.body;
    await UserModel.updateOne({ email });
    res.status(200).json({ status: "ok" });
  })
);

router.get(
  "/scores",
  asyncMiddleware(async (req, res, next) => {
    const users = await UserModel.find({}, "name");
    res.status(200).json(users);
  })
);

module.exports = router;
