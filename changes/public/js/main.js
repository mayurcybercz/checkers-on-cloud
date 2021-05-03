class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key, type) {
    super(scene, x, y, key);

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);
    this.setData("type", type);
  }

  moveUp(pos, MP) {
    if (pos[0] > 0 && pos[1] > 0) {
      if (this.scene.board[pos[0] - 1][pos[1] - 1] === 0) {
        MP.push([pos[0] - 1, pos[1] - 1]);
      }
    }

    if (pos[0] > 0 && pos[1] < 7) {
      if (this.scene.board[pos[0] - 1][pos[1] + 1] === 0) {
        MP.push([pos[0] - 1, pos[1] + 1]);
      }
    }

    return MP;
  }

  moveDown(pos, MP) {
    if (pos[0] < 7 && pos[1] > 0) {
      if (this.scene.board[pos[0] + 1][pos[1] - 1] === 0) {
        MP.push([pos[0] + 1, pos[1] - 1]);
      }
    }

    if (pos[0] < 7 && pos[1] < 7) {
      if (this.scene.board[pos[0] + 1][pos[1] + 1] === 0) {
        MP.push([pos[0] + 1, pos[1] + 1]);
      }
    }

    return MP;
  }

  jumpUp(pos, MP, type) {
    if (pos[0] > 1 && pos[1] > 1) {
      if (this.scene.board[pos[0] - 1][pos[1] - 1] !== 0) {
        if (
          this.scene.board[pos[0] - 1][pos[1] - 1].data.list.type === type &&
          this.scene.board[pos[0] - 2][pos[1] - 2] === 0
        ) {
          MP.push([pos[0] - 2, pos[1] - 2]);
          MP.push(this.doubleJumpUp(pos[0] - 2, pos[1] - 2, type));
          MP[MP.length - 1] === "" ? MP.pop() : null;
        }
      }
    }

    if (pos[0] > 1 && pos[1] < 6) {
      if (this.scene.board[pos[0] - 1][pos[1] + 1] !== 0) {
        if (
          this.scene.board[pos[0] - 1][pos[1] + 1].data.list.type === type &&
          this.scene.board[pos[0] - 2][pos[1] + 2] === 0
        ) {
          MP.push([pos[0] - 2, pos[1] + 2]);
          MP.push(this.doubleJumpUp(pos[0] - 2, pos[1] + 2, type));
          MP[MP.length - 1] === "" ? MP.pop() : null;
        }
      }
    }

    return MP;
  }

  jumpDown(pos, MP, type) {
    if (pos[0] < 6 && pos[1] > 1) {
      if (this.scene.board[pos[0] + 1][pos[1] - 1] !== 0) {
        if (
          this.scene.board[pos[0] + 1][pos[1] - 1].data.list.type === type &&
          this.scene.board[pos[0] + 2][pos[1] - 2] === 0
        ) {
          MP.push([pos[0] + 2, pos[1] - 2]);
          MP.push(this.doubleJumpDown(pos[0] + 2, pos[1] - 2, type));
          MP[MP.length - 1] === "" ? MP.pop() : null;
        }
      }
    }

    if (pos[0] < 6 && pos[1] < 6) {
      if (this.scene.board[pos[0] + 1][pos[1] + 1] !== 0) {
        if (
          this.scene.board[pos[0] + 1][pos[1] + 1].data.list.type === type &&
          this.scene.board[pos[0] + 2][pos[1] + 2] === 0
        ) {
          MP.push([pos[0] + 2, pos[1] + 2]);
          MP.push(this.doubleJumpDown(pos[0] + 2, pos[1] + 2, type));
          MP[MP.length - 1] === "" ? MP.pop() : null;
        }
      }
    }

    return MP;
  }

  doubleJumpUp(v, h, type) {
    this.DJ = [];
    if (v > 1 && h > 1 && this.scene.board[v - 1][h - 1] !== 0) {
      if (
        this.scene.board[v - 1][h - 1].data.list.type === type &&
        this.scene.board[v - 2][h - 2] === 0
      ) {
        this.DJ.push([
          [v, h],
          [v - 2, h - 2],
        ]);
        this.DJ.push(
          this.tripleJumpUp(
            v - 2,
            h - 2,
            [
              [v, h],
              [v - 2, h - 2],
            ],
            type
          )
        );
        this.DJ[this.DJ.length - 1] === "" ? this.DJ.pop() : null;
      }
    }

    if (v > 1 && h < 6 && this.scene.board[v - 1][h + 1] !== 0) {
      if (
        this.scene.board[v - 1][h + 1].data.list.type === type &&
        this.scene.board[v - 2][h + 2] === 0
      ) {
        this.DJ.push([
          [v, h],
          [v - 2, h + 2],
        ]);
        this.DJ.push(
          this.tripleJumpUp(
            v - 2,
            h + 2,
            [
              [v, h],
              [v - 2, h + 2],
            ],
            type
          )
        );
        this.DJ[this.DJ.length - 1] === "" ? this.DJ.pop() : null;
      }
    }

    if (this.getData("king")) {
      if (v < 6 && h > 1 && this.scene.board[v + 1][h - 1] !== 0) {
        if (
          this.scene.board[v + 1][h - 1].data.list.type === type &&
          this.scene.board[v + 2][h - 2] === 0
        ) {
          this.DJ.push([
            [v, h],
            [v + 2, h - 2],
          ]);
          this.DJ.push(
            this.tripleJumpUp(
              v + 2,
              h - 2,
              [
                [v, h],
                [v + 2, h - 2],
              ],
              type
            )
          );
          this.DJ[this.DJ.length - 1] === "" ? this.DJ.pop() : null;
        }
      }

      if (v < 6 && h < 6 && this.scene.board[v + 1][h + 1] !== 0) {
        if (
          this.scene.board[v + 1][h + 1].data.list.type === type &&
          this.scene.board[v + 2][h + 2] === 0
        ) {
          this.DJ.push([
            [v, h],
            [v + 2, h + 2],
          ]);
          this.DJ.push(
            this.tripleJumpUp(
              v + 2,
              h + 2,
              [
                [v, h],
                [v + 2, h + 2],
              ],
              type
            )
          );
          this.DJ[this.DJ.length - 1] === "" ? this.DJ.pop() : null;
        }
      }
    }

    if (this.DJ !== []) {
      return this.DJ;
    }

    return "";
  }

  doubleJumpDown(v, h, type) {
    this.DJ = [];

    if (this.getData("king")) {
      if (v > 1 && h > 1 && this.scene.board[v - 1][h - 1] !== 0) {
        if (
          this.scene.board[v - 1][h - 1].data.list.type === type &&
          this.scene.board[v - 2][h - 2] === 0
        ) {
          this.DJ.push([
            [v, h],
            [v - 2, h - 2],
          ]);
          this.DJ.push(
            this.tripleJumpDown(
              v - 2,
              h - 2,
              [
                [v, h],
                [v - 2, h - 2],
              ],
              type
            )
          );
          this.DJ[this.DJ.length - 1] === "" ? this.DJ.pop() : null;
        }
      }

      if (v > 1 && h < 6 && this.scene.board[v - 1][h + 1] !== 0) {
        if (
          this.scene.board[v - 1][h + 1].data.list.type === type &&
          this.scene.board[v - 2][h + 2] === 0
        ) {
          this.DJ.push([
            [v, h],
            [v - 2, h + 2],
          ]);
          this.DJ.push(
            this.tripleJumpDown(
              v - 2,
              h + 2,
              [
                [v, h],
                [v - 2, h + 2],
              ],
              type
            )
          );
          this.DJ[this.DJ.length - 1] === "" ? this.DJ.pop() : null;
        }
      }
    }

    if (v < 6 && h > 1 && this.scene.board[v + 1][h - 1] !== 0) {
      if (
        this.scene.board[v + 1][h - 1].data.list.type === type &&
        this.scene.board[v + 2][h - 2] === 0
      ) {
        this.DJ.push([
          [v, h],
          [v + 2, h - 2],
        ]);
        this.DJ.push(
          this.tripleJumpDown(
            v + 2,
            h - 2,
            [
              [v, h],
              [v + 2, h - 2],
            ],
            type
          )
        );
        this.DJ[this.DJ.length - 1] === "" ? this.DJ.pop() : null;
      }
    }

    if (v < 6 && h < 6 && this.scene.board[v + 1][h + 1] !== 0) {
      if (
        this.scene.board[v + 1][h + 1].data.list.type === type &&
        this.scene.board[v + 2][h + 2] === 0
      ) {
        this.DJ.push([
          [v, h],
          [v + 2, h + 2],
        ]);
        this.DJ.push(
          this.tripleJumpDown(
            v + 2,
            h + 2,
            [
              [v, h],
              [v + 2, h + 2],
            ],
            type
          )
        );
        this.DJ[this.DJ.length - 1] === "" ? this.DJ.pop() : null;
      }
    }

    if (this.DJ !== []) {
      return this.DJ;
    }

    return "";
  }

  tripleJumpUp(v, h, array, type) {
    if (v > 1 && h > 1 && this.scene.board[v - 1][h - 1] !== 0) {
      if (
        this.scene.board[v - 1][h - 1].data.list.type === type &&
        this.scene.board[v - 2][h - 2] === 0
      ) {
        array.push([v - 2, h - 2]);
      }
    }

    if (v > 1 && h < 6 && this.scene.board[v - 1][h + 1] !== 0) {
      if (
        this.scene.board[v - 1][h + 1].data.list.type === type &&
        this.scene.board[v - 2][h + 2] === 0
      ) {
        array.push([v - 2, h + 2]);
      }
    }

    if (this.getData("king")) {
      if (v < 6 && h > 1 && this.scene.board[v + 1][h - 1] !== 0) {
        if (
          this.scene.board[v + 1][h - 1].data.list.type === type &&
          this.scene.board[v + 2][h - 2] === 0
        ) {
          array.push([v + 2, h - 2]);
        }
      }

      if (v < 6 && h < 6 && this.scene.board[v + 1][h + 1] !== 0) {
        if (
          this.scene.board[v + 1][h + 1].data.list.type === type &&
          this.scene.board[v + 2][h + 2] === 0
        ) {
          array.push([v + 2, h + 2]);
        }
      }
    }

    if (array.length > 2) {
      return array;
    }

    return "";
  }

  tripleJumpDown(v, h, array, type) {
    if (this.getData("king")) {
      if (v > 1 && h > 1 && this.scene.board[v - 1][h - 1] !== 0) {
        if (
          this.scene.board[v - 1][h - 1].data.list.type === type &&
          this.scene.board[v - 2][h - 2] === 0
        ) {
          array.push([v - 2, h - 2]);
        }
      }

      if (v > 1 && h < 6 && this.scene.board[v - 1][h + 1] !== 0) {
        if (
          this.scene.board[v - 1][h + 1].data.list.type === type &&
          this.scene.board[v - 2][h + 2] === 0
        ) {
          array.push([v - 2, h + 2]);
        }
      }
    }

    if (v < 6 && h > 1 && this.scene.board[v + 1][h - 1] !== 0) {
      if (
        this.scene.board[v + 1][h - 1].data.list.type === type &&
        this.scene.board[v + 2][h - 2] === 0
      ) {
        array.push([v + 2, h - 2]);
      }
    }

    if (v < 6 && h < 6 && this.scene.board[v + 1][h + 1] !== 0) {
      if (
        this.scene.board[v + 1][h + 1].data.list.type === type &&
        this.scene.board[v + 2][h + 2] === 0
      ) {
        array.push([v + 2, h + 2]);
      }
    }

    if (array.length > 2) {
      return array;
    }

    return "";
  }

  update() {
    this.x =
      this.scene.game.config.width *
      this.scene.boardHValues[this.getData("boardH")];
    this.y =
      this.scene.game.config.height *
      this.scene.boardVValues[this.getData("boardV")];
  }
}
class BlackPiece extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key, "BlackPiece");
    this.setData("boardV", 0);
    this.setData("boardH", 0);
    this.setData("king", false);
  }

  movePossibility(color) {
    this.MP = [];
    this.pos = [this.getData("boardV"), this.getData("boardH")];
    const type = color ? "BlackPiece" : "RedPiece";

    this.MP = this.moveDown(this.pos, this.MP);
    this.MP = this.jumpDown(this.pos, this.MP, type);

    if (this.getData("king")) {
      this.MP = this.moveUp(this.pos, this.MP);
      this.MP = this.jumpUp(this.pos, this.MP, type);
    }

    return this.MP;
  }

  updatePosition(v, h) {
    this.setData("boardV", v);
    this.setData("boardH", h);

    if (v === 7) {
      this.setData("king", true);
      this.setTexture("blackChecker");
    }
  }
}

class RedPiece extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key, "RedPiece");
    this.setData("boardV", 0);
    this.setData("boardH", 0);
    this.setData("king", false);
  }

  movePossibility(color) {
    this.MP = [];
    this.pos = [this.getData("boardV"), this.getData("boardH")];
    const type = color ? "BlackPiece" : "RedPiece";

    this.MP = this.moveUp(this.pos, this.MP);
    this.MP = this.jumpUp(this.pos, this.MP, type);

    if (this.getData("king")) {
      this.MP = this.moveDown(this.pos, this.MP);
      this.MP = this.jumpDown(this.pos, this.MP, type);
    }

    return this.MP;
  }

  updatePosition(v, h) {
    this.setData("boardV", v);
    this.setData("boardH", h);

    if (v === 0) {
      this.setData("king", true);
      this.setTexture("redChecker");
    }
  }
}

function makeId(length) {
  // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const characters = "0123456789";
  let id = "";
  for (let i = 0; i < length; i += 1) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return id;
}

class SceneGame extends Phaser.Scene {
  constructor() {
    super({ key: "SceneGame" });
  }

  init(data) {
    this.socket = data.socket;
    this.boardID = data.boardID;
    this.color = data.color;
  }

  preload() {
    this.load.image("board", "content/board.png");
    this.load.image("redPiece", "content/redPiece.png");
    this.load.image("redChecker", "content/redChecker.png");
    this.load.image("blackPiece", "content/blackPiece.png");
    this.load.image("blackChecker", "content/blackChecker.png");
  }

  create() {
    this.boardImg = this.add.image(300, this.game.config.height * 0.5, "board");

    this.redPieces = this.add.group();
    this.blackPieces = this.add.group();
    this.turn = this.color;

    this.physics.add.collider(
      this.redPieces,
      this.blackPieces,
      (red, black) => {
        if ((this.turn && this.color) || (!this.turn && !this.color)) {
          this.board[black.getData("boardV")][black.getData("boardH")] = 0;
          black.destroy();
        } else {
          this.board[red.getData("boardV")][red.getData("boardH")] = 0;
          red.destroy();
        }
      }
    );

    this.playerNumber = this.color ? 0 : 1;
    this.boardVertValues = [0.11, 0.22, 0.33, 0.44, 0.55, 0.66, 0.77, 0.88];
    this.boardHorzValues = [
      0.09,
      0.171,
      0.253,
      0.335,
      0.415,
      0.498,
      0.582,
      0.663,
    ];

    this.board = this.createBoard();

    this.textConfig = {
      color: "white",
      fontFamily: "sans-serif",
      fontSize: "25px",
      lineHeight: 1.3,
      align: "center",
    };

    this.textGameNumber = this.add.text(
      610,
      this.game.config.height * 0.03,
      `Game number:\n ${this.boardID}`,
      this.textConfig
    );

    this.textPlay1 = this.add.text(
      610,
      this.game.config.height * 0.2,
      "Player 1 - Red",
      this.textConfig
    );
    this.textPlay1.setColor("white");

    this.textPlay1Turn = this.add.text(
      610,
      this.game.config.height * 0.3,
      "YOUR TURN",
      this.textConfig
    );
    this.textPlay1Turn.setColor("Yellow");

    this.textPlay2 = this.add.text(
      610,
      this.game.config.height * 0.6,
      "Player 2 - Black",
      this.textConfig
    );
    this.textPlay2.setColor("white");

    this.textPlay2Turn = this.add.text(
      610,
      this.game.config.height * 0.7,
      "YOUR TURN",
      this.textConfig
    );
    this.textPlay2Turn.setColor("Yellow");

    if (this.color) {
      this.textPlay2Turn.text = "OPPONENT'S\n TURN";
    } else {
      this.textPlay1Turn.text = "OPPONENT'S\n TURN";
    }

    this.changeTurn();

    this.ghostPieces = [];
    console.log(this.board);
    this.startGame();
  }

  startGame() {
    if (this.turn) {
      this.setInteractiveness(this.boardVertValues, this.boardHorzValues);
    } else {
      console.log("Others turn");
      this.wait();
    }
  }

  wait() {
    this.time.addEvent({
      delay: 0,
      callback() {
        this.socket.on(
          "changeTurn",
          (value, opPiece, positionArray, gameOver) => {
            if (gameOver) {
              this.time.addEvent({
                delay: 3000,
                callback() {
                  this.scene.start("SceneGameOver", { victor: value });
                },
                callbackScope: this,
                loop: true,
              });
            }
            if (value === this.color) {
              let pisc = "";
              const group = this.color ? this.blackPieces : this.redPieces;
              group.getChildren().forEach((piece) => {
                if (
                  piece.getData("boardV") === opPiece[0] &&
                  piece.getData("boardH") === opPiece[1]
                ) {
                  pisc = piece;
                }
              });
              this.oponentMovement(pisc, positionArray);
            }
          }
        );
      },
      callbackScope: this,
      loop: false,
    });
  }

  oponentMovement(piece, positionArray) {
    const v = piece.getData("boardV");
    const h = piece.getData("boardH");
    const lenf = positionArray.length;
    this.board[v][h] = 0;

    for (let i = 0; i < lenf; i += 1) {
      this.moveAnim(piece, positionArray[i], i * 1000);
    }

    setTimeout(() => {
      this.board[positionArray[lenf - 1][0]][
        positionArray[lenf - 1][1]
      ] = piece;
      piece.updatePosition(...positionArray[lenf - 1]);
      this.checkEndGame();
      this.turn = true;
      this.changeTurn();
      this.setInteractiveness(this.boardVertValues, this.boardHorzValues);
    }, 1000 * lenf);
  }

  deleteInteractiveness() {
    const group = this.color ? this.redPieces : this.blackPieces;
    group.getChildren().forEach((piece) => {
      piece.disableInteractive();
    });
  }

  multiJump(piece, positionArray) {
    const v = piece.getData("boardV");
    const h = piece.getData("boardH");
    const lenf = positionArray.length;
    this.board[v][h] = 0;
    this.deleteGhosts();

    for (let i = 0; i < lenf; i += 1) {
      this.moveAnim(piece, positionArray[i], i * 1000);
    }

    setTimeout(() => {
      this.board[positionArray[lenf - 1][0]][
        positionArray[lenf - 1][1]
      ] = piece;
      piece.updatePosition(...positionArray[lenf - 1]);
      this.deleteInteractiveness();
      this.checkEndGame([v, h], positionArray, this.boardID);
      this.turn = false;
      this.changeTurn();
      this.socket.emit(
        "change",
        this.color,
        [v, h],
        positionArray,
        this.boardID
      );
      this.wait();
    }, 1000 * lenf);
  }

  checkEndGame(piece, positionArray, bID) {
    this.group = this.color ? this.blackPieces : this.redPieces;
    if (
      this.group.children.size === 0 ||
      this.checkMovePossibility(this.group)
    ) {
      this.socket.emit("gameOver", this.color, piece, positionArray, bID);
      this.time.addEvent({
        delay: 3000,
        callback() {
          this.scene.start("SceneGameOver", { victor: this.color });
        },
        callbackScope: this,
        loop: true,
      });
    }
  }

  checkMovePossibility(group) {
    // eslint-disable-next-line consistent-return
    group.getChildren().forEach((piece) => {
      if (piece.movePossibility(!this.color).length !== 0) {
        return true;
      }
    });

    return false;
  }

  moveAnim(piece, newPosition, delay = 0) {
    this.movement = this.tweens.add({
      targets: piece,
      x: this.game.config.width * this.boardHorzValues[newPosition[1]],
      y: this.game.config.height * this.boardVertValues[newPosition[0]],
      ease: "Power1",
      delay,
      duration: 1000,
      repeat: 0,
    });
    return this.movement;
  }

  createBoard() {
    this.board = [];
    for (let i = 0; i < 8; i += 1) {
      this.board.push([0, 0, 0, 0, 0, 0, 0, 0]);
    }

    for (let i = 0; i < 8; i += 1) {
      if (i % 2 === 0) {
        this.board[5][i] = this.createPiece(5, i, true);
        this.board[1][i] = this.createPiece(1, i, false);
        this.board[7][i] = this.createPiece(7, i, true);
      } else {
        this.board[6][i] = this.createPiece(6, i, true);
        this.board[2][i] = this.createPiece(2, i, false);
        this.board[0][i] = this.createPiece(0, i, false);
      }
    }

    return this.board;
  }

  createPiece(v, h, color) {
    if (color) {
      this.piece = new RedPiece(
        this,
        this.game.config.width * this.boardHorzValues[h],
        this.game.config.height * this.boardVertValues[v],
        "redPiece"
      );
    } else {
      this.piece = new BlackPiece(
        this,
        this.game.config.width * this.boardHorzValues[h],
        this.game.config.height * this.boardVertValues[v],
        "blackPiece"
      );
    }
    this.piece.setScale(0.5);
    this.piece.updatePosition(v, h);
    color ? this.redPieces.add(this.piece) : this.blackPieces.add(this.piece);
    return this.piece;
  }

  deleteGhosts() {
    this.ghostPieces.forEach((value) => {
      value.destroy();
    });
    this.ghostPieces = [];
  }

  changeTurn() {
    if ((this.turn && this.color) || (!this.turn && !this.color)) {
      this.textPlay1Turn.setColor("red");
      this.textPlay2Turn.setColor("gray");
    } else {
      this.textPlay1Turn.setColor("gray");
      this.textPlay2Turn.setColor("red");
    }
  }

  setInteractiveness(boardV, boardH) {
    this.group = this.color ? this.redPieces : this.blackPieces;
    this.ghostColor = this.color ? "redPiece" : "blackPiece";
    this.group.getChildren().forEach((piece) => {
      if (piece.movePossibility(this.color).length !== 0) {
        piece.setInteractive();

        piece.on("pointerover", () => {
          piece.setScale(0.55);
        });

        piece.on("pointerout", () => {
          piece.setScale(0.5);
        });

        piece.on("pointerup", () => {
          const possMoves = piece.movePossibility(this.color);
          this.deleteGhosts();
          for (let i = 0; i < possMoves.length; i += 1) {
            if (typeof possMoves[i][0] === "object") {
              for (let j = 0; j < possMoves[i].length; j += 1) {
                const ghost = this.add
                  .image(
                    this.game.config.width *
                      boardH[possMoves[i][j][possMoves[i][j].length - 1][1]],
                    this.game.config.height *
                      boardV[possMoves[i][j][possMoves[i][j].length - 1][0]],
                    this.ghostColor
                  )
                  .setScale(0.5)
                  .setAlpha(0.5);

                ghost.setInteractive();
                ghost.on("pointerup", () => {
                  this.multiJump(piece, possMoves[i][j]);
                });
                this.ghostPieces.push(ghost);
              }
            } else {
              const ghost = this.add
                .image(
                  this.game.config.width * boardH[possMoves[i][1]],
                  this.game.config.height * boardV[possMoves[i][0]],
                  this.ghostColor
                )
                .setScale(0.5)
                .setAlpha(0.5);

              ghost.setInteractive();
              ghost.on("pointerup", () => {
                this.multiJump(piece, [possMoves[i]]);
              });
              this.ghostPieces.push(ghost);
            }
          }
        });
      }
    });
  }
}

class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMainMenu" });
  }

  create() {
    // eslint-disable-next-line no-undef
    this.socket = io();
    this.color = false;

    this.socket.on("newplayer", (sckt) => {
      console.log(sckt);
    });

    this.startGame = this.add.text(
      this.game.config.width * 0.2,
      this.game.config.height * 0.2,
      "Start new Ninja Checkers",
      {
        color: "#d0c600",
        fontFamily: "sans-serif",
        fontSize: "30px",
        lineHeight: 1.3,
        align: "center",
      }
    );

    this.startGame.setInteractive();
    this.startGame.on("pointerup", () => {
      const id = makeId(4);
      this.startGame.text = id;
      this.startGame.disableInteractive();

      this.socket.emit("startGame", id);

      this.socket.on("startingGame", (message, boardID) => {
        this.color = true;
        if (message) {
          this.startGame.text = `Waiting for the other player!\n Your id is ${id}`;
        } else {
          this.scene.start("SceneGame", {
            socket: this.socket,
            color: this.color,
            boardID,
          });
        }
      });
    });

    this.joinGame = this.add.text(
      this.game.config.width * 0.2,
      this.game.config.height * 0.4,
      "Join a friend's game",
      {
        color: "#d0c600",
        fontFamily: "sans-serif",
        fontSize: "30px",
        lineHeight: 1.3,
        align: "center",
      }
    );

    this.joinGame.setInteractive();
    this.joinGame.on("pointerup", () => {
      this.gameID = "";

      const div = document.createElement("div");
      div.innerHTML = `
        <input type="text" id="gameID" placeholder="Enter the game's ID" style="font-size: 1.2rem; width: 200px"><br>
        <input type="button" name="submitButton" value="Enter game" style="font-size: 1.5rem">
      `;

      const element = this.add.dom(800, 280, div);
      element.addListener("click");

      element.on("click", (event) => {
        if (event.target.name === "submitButton") {
          const inputText = document.getElementById("gameID");
          if (inputText.value !== "") {
            element.removeListener("click");
            element.setVisible(false);
            this.gameID = inputText.value;

            this.socket.emit("joinGame", this.gameID);

            this.socket.on("gameBegin", (message, boardID) => {
              this.color = false;
              if (message) {
                this.scene.start("SceneGame", {
                  socket: this.socket,
                  color: this.color,
                  boardID,
                });
              }
            });
          }
        }
      });
    });
  }
}

class SceneGameOver extends Phaser.Scene {
  constructor() {
    super({ key: "SceneGameOver" });
  }

  init(data) {
    this.victor = data.victor;
  }

  create() {
    if (this.victor) {
      this.textWon = "Game Over\n Player 1 wins!!!!";
    } else {
      this.textWon = "Game Over\n Player 2 wins!!!!";
    }

    this.gameOverSceneScore = this.add.text(
      this.game.config.width * 0.3,
      this.game.config.height * 0.3,
      this.textWon,
      {
        color: "#d0c600",
        fontFamily: "sans-serif",
        fontSize: "50px",
        lineHeight: 1.3,
        align: "center",
      }
    );
  }
}

var config = {
  type: Phaser.AUTO,
  parent: "game",
  width: 800,
  height: 600,
  backgroundColor: "blue",
  dom: {
    createContainer: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
    },
  },
  scene: [SceneMainMenu, SceneGame, SceneGameOver],
  pixelArt: true,
  roundPixels: true,
};

const game = new Phaser.Game(config);
