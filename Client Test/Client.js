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
const socket = new WebSocket('ws://f28wp.herokuapp.com/:80'); // --MSI Home

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
    if (message.split(';')[0] == LOGIN) {
      my_name = message.split(';')[1];
    }
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























(function (){
    var canvas = document.getElementById("gamecanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}());

// PAGE CODE

function submitBtnPress() {

    var usrName = document.getElementById("UsernameInput").value;
    var usrPsswd = document.getElementById("UsernamePassword").value;

    if (usrName != "" && usrPsswd != "") {
        login(usrName, usrPsswd);

        var r = document.getElementById("UserLogin").style;
        r.opacity = 1;

        var table = document.getElementById("Leaderboard").style.visibility = "visible";
        var scoreTable = document.getElementById("score").style.visibility = "visible";
        fade(table);

        (function fade() {
            (r.opacity -= .1) < 0 ? r.display = "none" : setTimeout(fade, 40)
        })();

        (function fade() {
            (scoreTable.opacity -= .1) < 0 ? scoreTable.display = "none" : setTimeout(fade, 40)
        })();

    } else{
        alert("You must enter username and password");
    }
}

function createBtnPress() {

    var createUsrName = document.getElementById("createUsernameInput").value;
    var createUsrPsswd = document.getElementById("createUsernamePassword").value;

    if (createUsrName != "" && createUsrPsswd != "") {
        register(createUsrName, createUsrPsswd);
        
    } else{
        alert("username and password");
    }
}


function btnPress() {
    var s = document.getElementById("PlayMenu").style;
    var r = document.getElementById("UserLogin").style.visibility = "visible";


    s.opacity = 1;
    (function fade() {
        (s.opacity -= .1) < 0 ? s.display = "none" : setTimeout(fade, 40)
    })();
}

function registerBtnPress() {

    var s = document.getElementById("UserLogin").style.visibility = "hidden";
    var r = document.getElementById("RegisterUser").style.visibility = "visible";

}

function loginBtnPress() {

    var s = document.getElementById("RegisterUser").style = "hidden";
    var r = document.getElementById("UserLogin").style.visibility = "visible";

}

function fade(element) {
    (element.opacity += .1) < 0 ? element.display = "none" : setTimeout(fade, 70)
};


// PUBLIC EVENTS
// Receive Co-ordinates
function oncoords(data) {
  // For each incoming player co-ord
  outer: for (var i in data) {
    var split_data = data[i].split('@');
    // console.log(split_data);
    // For each existing player
    for (var s in snakes) {
      if (snakes[s].name === split_data[0]) {
        snakes[s].x.push(split_data[1]);
        snakes[s].y.push(split_data[2]);
        // console.log(snakes[i].x);
        if (snakes[s].x.length > 200) {
          snakes[s].x.shift();
          snakes[s].y.shift();
        }
        continue outer;
      }
    }
    console.log('Adding: ' + split_data[0]);
    snakes.push(new Snake(split_data[0], split_data[1], split_data[2]));
  }
  outer: for (var i in snakes) {
    for (var j in data) {
      if (snakes[i].name === data[j].split('@')[0]) {
        continue outer;
      }
    }
    console.log('Deleting: ' + snakes[i].name);
    snakes.splice(i, 1);
  }
  draw();
  tick();
};

// Login response
var my_name;
function login_response(message) {
    console.log(message);
    // player = new Player('ME', 250, 250);
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
var currentDirection;
// PAGE CODE

function tick() {
  var x_out = 0;
  var y_out = 0;
  switch (key) {
    case 'w':
      if(currentDirection !== "down"){
        currentDirection = "up";
        y_out--;
        break;
      } else {
        y_out++;
        break;
      }
    case 'a':
      if(currentDirection !== "right"){
        currentDirection = "left";
        x_out--;
        break;
      } else {
        x_out++;
        break;
      }
    case 's':
      if(currentDirection !== "up"){
        currentDirection = "down";
        y_out++;
        break;
      } else {
        y_out--;
        break;
      }
    case 'd':
      if(currentDirection !== "left"){
        currentDirection = "right";
        x_out++;
        break;
      } else {
        x_out--;
        break;
      }
  }
  // Constrain
  sendcoords(x_out , y_out);
};
var score = 0;

var interval = setInterval(increment, 1000);

function increment(){
  score += 1;
}
// Only for debugging. Do not use internalsend
function sendField() {
    var message = document.getElementById("sendbox").value;
    internalsend(message);
}

var frames = 0;
// Sizing
// get min size
var w = window.innerWidth;
var h = window.innerHeight;
var max = w>h ? h : w;
// Set canvas size
document.getElementById("gamecanvas").width = max;
document.getElementById("gamecanvas").height = max;
// set bounds
document.getElementById("gamecanvas").style.position = "absolute";
document.getElementById("gamecanvas").style.left = ((w - max)/2) + 'px';
document.getElementById("gamecanvas").style.top = ((h - max)/2) + 'px';
// Draw
function draw() {
  frames++;
  document.getElementById("score").innerHTML = 'Score: ' + (score);
  var canvas = document.getElementById('gamecanvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, max, max);
    ctx.strokeStyle = "green";
    ctx.strokeRect(0, 0, max, max);
    //ctx.fillStyle = 'white';
    for (var i in snakes) {
      // Background
      ctx.globalAlpha = 1;
      ctx.strokeStyle = snakes[i].name == my_name ? 'green' : 'red';
      ctx.lineWidth = 7;
      ctx.beginPath();
      var last_x = snakes[i].x[0];
      var last_y = snakes[i].y[0];
      ctx.moveTo(last_x, last_y);
      for (var j in snakes[i].x) {
        var x_dif = last_x - snakes[i].x[j];
        var y_dif = last_y - snakes[i].y[j];
        if ( !(x_dif > 50 || x_dif < -50 || y_dif > 50 || y_dif < -50) ) {
          ctx.lineTo(snakes[i].x[j], snakes[i].y[j]);
        } else {
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(snakes[i].x[j], snakes[i].y[j]);
        }
        last_x = snakes[i].x[j];
        last_y = snakes[i].y[j];
      }
      ctx.stroke();
      // Foreground
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.beginPath();
      var last_x = snakes[i].x[0];
      var last_y = snakes[i].y[0];
      ctx.moveTo(last_x, last_y);
      for (var j in snakes[i].x) {
        var x_dif = last_x - snakes[i].x[j];
        var y_dif = last_y - snakes[i].y[j];
        if ( !(x_dif > 50 || x_dif < -50 || y_dif > 50 || y_dif < -50) ) {
          ctx.lineTo(snakes[i].x[j], snakes[i].y[j]);
        } else {
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(snakes[i].x[j], snakes[i].y[j]);
        }
        last_x = snakes[i].x[j];
        last_y = snakes[i].y[j];
      }
      ctx.stroke();
      // Draw name
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'white';
      ctx.font = "20px Comic Sans MS";
      ctx.fillText(snakes[i].name, parseInt(snakes[i].x[snakes[i].x.length-1]) + 5, parseInt(snakes[i].y[snakes[i].y.length-1]) - 5);
    }
  }
};

setInterval(function fps() {
  document.getElementById("fps").innerHTML = 'Hz: ' + (frames);
  frames = 0;
}, 1000);

draw();
increment();


var key = 'w';

document.onkeydown = function (e) {
  switch(e.code) {
    case 'KeyW' :
      key = 'w';
      break;
    case 'KeyA' :
      key = 'a';
      break;
    case 'KeyS' :
      key = 's';
      break;
    case 'KeyD' :
      key = 'd';
      break;
  }
};
