module.exports = server => {
  // variables
  var players = [] || {};
  //

  const io = require("socket.io")(server);
  io.on("connect", socket => {
    console.log("connectado Alguem");

    var currentPlayer = "";
    var currentCanvas = 0;
    socket.on("new", Onnew);

    // Functions
    function Onnew(data) {
      currentCanvas = data.canvas;
      const { x, y, color, size, life } = data;
      newUser = {
        x,
        y,
        color,
        size,
        life,
        id: socket.id
      };
      currentPlayer = newUser;
      players[socket.id] = newUser;
      // socket.emit("PlayerLocal", newUser);

      socket.emit("Current", currentPlayer);

      setTimeout(() => {
        for (e in players) {
          socket.emit("PlayerLocal", players[e]);
          socket.broadcast.emit("PlayerLocal", players[e]);
        }
      }, 1000);
    }

    // moviment
    socket.on("moviment", data => {
      const { moveCima, moveBaxo, moveEsquerda, moveDireita } = data;
      for (p in players) {
        if (currentPlayer.id == players[p].id) {
          move(
            players[p],
            moveCima,
            moveBaxo,
            moveEsquerda,
            moveDireita,
            currentCanvas
          );

          socket.emit("moviment", players[p]);
          socket.broadcast.emit("moviment", players[p]);
        }
      }
    });

    socket.on("disconnect", () => {
      for (p in players) {
        if (players[p].id == currentPlayer.id) {
          socket.broadcast.emit("desconnect", currentPlayer.id);
          delete players[p];
        }
      }
    });
  });
};
function move(currentP, moveCima, moveBaxo, moveEsquerda, moveDireita, canvas) {
  if (moveCima) {
    if (currentP.y >= 0) {
      currentP.y -= 8;
    }
  }
  if (moveBaxo) {
    if (currentP.y <= canvas.height - 50) {
      currentP.y += 8;
    }
  }
  if (moveEsquerda) {
    if (currentP.x >= 0) {
      currentP.x -= 8;
    }
  }
  if (moveDireita) {
    if (currentP.x <= canvas.width - 25) {
      currentP.x += 8;
    }
  }
}
