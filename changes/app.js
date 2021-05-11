require("dotenv").config();

// Mongo DB connection
const mongoose = require("mongoose");
const uri = process.env.MONGO_CONNECTION_URL;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (error) => {
  console.log(error);
  process.exit(1);
});
mongoose.connection.on("connected", (error) => {
  console.log("connected to mongo");
});

// Set up express server
const express = require("express");
const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server);

const players = {};
const games = {};

io.on("connection", function (socket) {
  console.log("a user connected");
  console.log(Object.size(players));
  const number = Object.size(players);

  players[number] = {
    players: socket.id,
    boardId: "",
  };

  socket.on("startGame", (bID) => {
    players[number].boardId = bID;
    games[bID] = {
      play1: players[number],
      play2: "",
    };
    console.log(games);
    socket.emit("startingGame", true, players);
  });

  //TODO: emit a signal if the room is full
  socket.on("joinGame", (bID) => {
    players[number].boardId = bID;
    if (games[bID].play2 === "") {
      games[bID].play2 = players[number];
      setTimeout(() => {
        io.to(games[bID].play1.playerId).emit("startingGame", false, bID);
        io.to(games[bID].play2.playerId).emit("gameBegin", true, bID);
      }, 2000);
    }
  });

  socket.on("change", (value, piece, positionArray, bID) => {
    if (value) {
      io.to(games[bID].play2.playerId).emit(
        "changeTurn",
        !value,
        piece,
        positionArray,
        false
      );
    } else {
      io.to(games[bID].play1.playerId).emit(
        "changeTurn",
        !value,
        piece,
        positionArray,
        false
      );
    }
  });

  // TODO: need redo the game over section
  socket.on("gameOver", (value, piece, positionArray, bID) => {
    if (value) {
      io.to(games[bID].play2.playerId).emit(
        "changeTurn",
        !value,
        piece,
        positionArray,
        false
      );
    } else {
      io.to(games[bID].play1.playerId).emit(
        "changeTurn",
        !value,
        piece,
        positionArray,
        false
      );
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete players[socket.id];
  });
});

const cookieParser = require("cookie-parser");
const passport = require("passport");

// Custom middleware
const routes = require("./routes/main");
const secureRoutes = require("./routes/secure");

const port = process.env.PORT || 3000;

// Middleware used
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

require("./auth/auth");

app.get(
  "/game.html",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    res.sendFile(`${__dirname}/public/game.html`);
  }
);

app.get(
  "/home.html",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    res.sendFile(`${__dirname}/public/home.html`);
  }
);

app.use(express.static(`${__dirname}/public`));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// Routes
app.use("/", routes);
app.use("/", passport.authenticate("jwt", { session: false }), secureRoutes);

// Default routes
app.use((req, res, next) => {
  res.status(404);
  res.json({ message: "404 - Not Found" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err });
});

server.listen(port, () => {
  console.log(`Listening on port ${server.address().port}`);
});

Object.size = (obj) => {
  let size = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      size += 1;
    }
  }
  return size;
};
