// sockets
var socket = io(":3000");
var width = $("html").width(),
  height = $("html").height();

// keys
const keys = {
  UP: 38,
  DOWN: 40,
  right: 39,
  left: 37
};
var movement = {
  moveEsquerda: false,
  moveDireita: false,
  moveCima: false,
  moveBaxo: false
};
var cnv = document.querySelector("canvas");
var ctx = cnv.getContext("2d");
cnv.width = width;
cnv.height = height - 20;

var players = [] || {};
var currentPlayer = "";

window.addEventListener("keydown", keydownHandler);
window.addEventListener("keyup", keyupHandler);

function collider() {
  for (e in players) {
    // if (players[e].id !== currentPlayer.id) {
    const { x, y, size } = currentPlayer;
    if (
      x + size > players[e].x &&
      x < players[e].x + size &&
      y + size > players[e].y &&
      y < players[e].y + size
    ) {
      currentPlayer.cor = "#f00";
    } else {
      currentPlayer.cor = "#00f";
    }
    // }
  }
}

function render() {
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  for (p in players) {
    ctx.fillStyle = players[p].cor;
    ctx.fillRect(players[p].x, players[p].y, 50, 50);
  }
}

function keyupHandler() {
  movement.moveBaxo = false;
  movement.moveCima = false;
  movement.moveDireita = false;
  movement.moveEsquerda = false;
  socket.emit("moviment", movement);
}

function keydownHandler(e) {
  var keyEvent = e.keyCode;
  if (keyEvent == keys.left && keyEvent !== keys.right) {
    movement.moveEsquerda = true;
    movement.moveDireita = false;
  }
  if (keyEvent == keys.right && keyEvent !== keys.left) {
    movement.moveEsquerda = false;
    movement.moveDireita = true;
  }
  if (keyEvent == keys.UP && keyEvent !== keys.DOWN) {
    movement.moveCima = true;
    movement.moveBaxo = false;
  }
  if (keyEvent == keys.DOWN && keyEvent !== keys.UP) {
    movement.moveCima = false;
    movement.moveBaxo = true;
  }
  socket.emit("moviment", movement);
  // render();
}

function update() {
  requestAnimationFrame(update, cnv);
  render();
  collider();
}
update();

// sockets events
socket.emit("new", {
  x: 10,
  y: 10,
  cor: "#00f",
  size: 50,
  life: 100,
  canvas: {
    width,
    height
  }
});

socket.on("PlayerLocal", data => {
  players.push(data);
});
socket.on("Current", data => {
  currentPlayer = data;
});
socket.on("moviment", data => {
  for (p in players) {
    if (players[p].id == data.id) {
      players[p] = data;
      currentPlayer = data;
    }
  }
  render();
});

socket.on("desconnect", data => {
  for (d in players) {
    if (players[d].id == data) {
      players.splice(d, 1);
    }
  }
  render();
});
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

cnv.addEventListener(
  "mousemove",
  function(evt) {
    var mousePos = getMousePos(cnv, evt);
    var message = "Mouse position: " + mousePos.x + "," + mousePos.y;
    // console.log(mousePos);
  },
  false
);
cnv.addEventListener(
  "click",
  function(evt) {
    console.log("mouse: " + evt.x, evt.y);
    console.log("player: " + currentPlayer.x, currentPlayer.y);
  },
  false
);
