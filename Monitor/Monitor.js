// SOCKET INTERFACE

// Action codes // Keep synced with server codes
const PLAINTEXT = '0';
const REGISTER = '1';
const LOGIN = '2';
const CLIENT_TO_SERVER_COORDS = '3';
const SERVER_TO_CLIENT_COORDS = '4';
const LOGIN_SUCCESS = '5';

// Create WebSocket
//const socket = new WebSocket('ws://137.195.109.210:8001'); // --MSI Heriot-Watt
const socket = new WebSocket('ws://192.168.0.11:8001'); // --MSI Home

// PRIVATE EVENTS
// Connection event
socket.onopen = function () {
    console.log('Server connection established.');
};
// Error event
socket.onerror = function (error) {
    console.log('Error: ', error);
};
// Message event
socket.onmessage = function (e) {
    var splitmessage = e.data.split(';');
    var actioncode = splitmessage[0];
    var primarydata = splitmessage[1];
    var secondarydata = splitmessage[2];
    var tertiarydata = splitmessage[3];
    switch (actioncode) {
        case PLAINTEXT:
          console.log('Server: ', primarydata);
          break;
        case SERVER_TO_CLIENT_COORDS:
          splitmessage.shift();
          oncoords(splitmessage);
          break;
        case LOGIN_SUCCESS:
          login_response(primarydata);
    }
};

// PRIVATE METHODS
// Send to server // Only for interface use
function internalsend(message) {
    // console.log('Sending: ', message);
    socket.send(message);
};

// PUBLIC METHODS
// Send message to all
function sendmessage(message) {
    internalsend(PLAINTEXT + ';' + message);
};

// Send register request
function register(username, password) {
    internalsend(REGISTER + ';' + username + ';' + password);
};

// Send login request
function login(username, password) {
    internalsend(LOGIN + ';' + username + ';' + password);
};

// Send co-ordinates
function sendcoords(x, y) {
    internalsend(CLIENT_TO_SERVER_COORDS + ';' + x + ';' + y);
};

// PUBLIC EVENTS
// Receive Co-ordinates
function oncoords(data) {
  var array = [];
  for (var i in data) {
    var split_data = data[i].split('@');
    // console.log(split_data);
    array.push(new Player(split_data[0], split_data[1], split_data[2]));
    players = array;
  }
};

// Login response
function login_response(message) {
    console.log(message);
    player = new Player('ME', 250, 250);
    var send_data = setInterval(function sd() {
      player.x += Math.floor(Math.random() * 7) - 3;
      player.y += Math.floor(Math.random() * 7) - 3;
      if (player.x < 0 || player.x > 500 || player.y < 0 || player.y > 500) {
        player.x = 250;
        player.y = 250;
      }
      sendcoords(player.x , player.y);
      draw();
    }, 333);
};

class Player {
  constructor(in_name, in_x, in_y) {
    this.name = in_name;
    this.x = in_x;
    this.y = in_y;
  };
};

var players = [];
var player;
// PAGE CODE

// Set the enter key to activate send button
var input = document.getElementById("sendbox");
input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        document.getElementById("sendbutton").click();
        input.value = '';
    }
});

// Only for debugging. Do not use internalsend
function sendField() {
    var message = document.getElementById("sendbox").value;
    internalsend(message);
}

// Draw
function draw() {
  var canvas = document.getElementById('gamecanvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'navy';
    ctx.fillRect(0, 0, 500, 500);
    ctx.fillStyle = 'black';
    ctx.strokeRect(0, 0, 500, 500);
    ctx.fillStyle = 'white';
    for (var i in players) {
      ctx.fillRect(players[i].x, players[i].y, 3, 3);
    }
  }
};

draw();
