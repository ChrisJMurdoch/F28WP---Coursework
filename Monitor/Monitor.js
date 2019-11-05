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
    // login('a', 'a');
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
  /*
  var array = [];
  for (var i in data) {
    var split_data = data[i].split('@');
    array.push(new Player(split_data[0], split_data[1], split_data[2]));
    players = array;
  }
  draw();
  tick();
  */

  outer: for (var i in data) {
    var split_data = data[i].split('@');
    console.log(split_data);
    for (var s in snakes) {
      if (snakes[s].name === split_data[0]) {
        snakes[s].x.push(split_data[1]);
        snakes[s].y.push(split_data[2]);
        // console.log(snakes[i].x);
        if (snakes[i].x.length > 200) {
          snakes[i].x.shift();
          snakes[i].y.shift();
        }
        continue outer;
      }
    }
    console.log('new');
    snakes.push(new Snake(split_data[0], split_data[1], split_data[2]));
  }
  draw();
  tick();

};

// Login response
function login_response(message) {
    console.log(message);
    player = new Player('ME', 250, 250);
    tick();
};

class Player {
  constructor(in_name, in_x, in_y) {
    this.name = in_name;
    this.x = in_x;
    this.y = in_y;
  };
};

class Snake {
  constructor(in_name, in_x, in_y) {
    this.name = in_name;
    this.x = [in_x];
    this.y = [in_y];
  };
};

var snakes = [];
var players = [];
var player;
// PAGE CODE

function tick() {
  var x_out = 0;
  var y_out = 0;
  if (W) {
    y_out--;
  }
  if (A) {
    x_out--;
  }
  if (S) {
    y_out++;
  }
  if (D) {
    x_out++;
  }
  // Constrain
  sendcoords(x_out , y_out);
};

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

var frames = 0;
// Draw
function draw() {
  frames++;
  var canvas = document.getElementById('gamecanvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'navy';
    ctx.fillRect(0, 0, 500, 500);
    ctx.fillStyle = 'black';
    ctx.strokeRect(0, 0, 500, 500);
    ctx.fillStyle = 'white';
    for (var i in snakes) {
      for (var j in snakes[i].x) {
        ctx.fillRect(snakes[i].x[j], snakes[i].y[j], 3, 3);
      }
    }
  }
};

setInterval(function fps() {
  document.getElementById("fps").innerHTML = 'Hz: ' + (frames);
  frames = 0;
}, 1000);

draw();

var W = false;
var A = false;
var S = false;
var D = false;
document.onkeydown = function (e) {
  switch(e.code) {
    case 'KeyW' :
      W = true;
      break;
    case 'KeyA' :
      A = true;
      break;
    case 'KeyS' :
      S = true;
      break;
    case 'KeyD' :
      D = true;
      break;
  }
};

document.onkeyup = function (e) {
  switch(e.code) {
    case 'KeyW' :
      W = false;
      break;
    case 'KeyA' :
      A = false;
      break;
    case 'KeyS' :
      S = false;
      break;
    case 'KeyD' :
      D = false;
      break;
  }
};
