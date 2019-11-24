// SOCKET INTERFACE

// Action codes // Keep synced with server codes
const PLAINTEXT = '0';
const REGISTER = '1';
const LOGIN = '2';
const CLIENT_TO_SERVER_COORDS = '3';
const SERVER_TO_CLIENT_COORDS = '4';
const LOGIN_SUCCESS = '5';
const DEATH = '6';
const LEADERBOARD = '7';

// Create WebSocket
//const socket = new WebSocket('ws://localhost:80'); // --Localhost
const socket = new WebSocket('ws://f28wp.herokuapp.com/:80'); // --Heroku

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
          alert(primarydata, "Incorrect Login Details");
          break;
        case SERVER_TO_CLIENT_COORDS:
          splitmessage.shift();
          oncoords(splitmessage);
          break;
        case LOGIN_SUCCESS:
          login_response(primarydata);
          break;
        case DEATH:
          death(primarydata);
          break;
        case LEADERBOARD:
          leaderboard(primarydata.split('@'));
          break;
    }
};

function leaderboard(data) {
  for (var i in data) {
    var username = data[i].split('#')[0];
    var score = data[i].split('#')[1];
    console.log(username, score);
  }
  table = document.getElementById('leaderboard');
  table.rows[2].cells[1].innerHTML = data[0].split('#')[0];
  table.rows[3].cells[1].innerHTML = data[1].split('#')[0];
  table.rows[4].cells[1].innerHTML = data[2].split('#')[0];
  table.rows[2].cells[2].innerHTML = data[0].split('#')[1];
  table.rows[3].cells[2].innerHTML = data[1].split('#')[1];
  table.rows[4].cells[2].innerHTML = data[2].split('#')[1];
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


// PAGE CODE
var score = 0;
function increment(){
  score += 1;
}

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
        snakes[s].t.push(Date.now());
        // console.log(snakes[i].x);
        /*
        if (snakes[s].x.length > 5) {
          snakes[s].x.shift();
          snakes[s].y.shift();
        }
        */
        var time = Date.now();
        while (true) {
          if (time - snakes[s].t[0] > 2000) {
            snakes[s].t.shift();
            snakes[s].x.shift();
            snakes[s].y.shift();
          } else {
            break;
          }
        }
        continue outer;
      }
    }
    //console.log('Adding: ' + split_data[0]);
    snakes.push(new Snake(split_data[0], split_data[1], split_data[2]));
  }
  outer: for (var i in snakes) {
    for (var j in data) {
      if (snakes[i].name === data[j].split('@')[0]) {
        continue outer;
      }
    }
    if (snakes[i].name === my_name) {
      death(snakes[i].name);
    } else {
      death(snakes[i].name);
    }
  }
  draw();
  tick();
};

// function to fade div elements
function fade(element){
    element.opacity = 1;
    (element.opacity -= .1 < 0) ? element.display = "none" : setTimeout(fade, 40);
}

// Login response
var my_name;
function login_response(message) {
    console.log(message);

    var r = document.getElementById("LoginMenu").style;
    r.opacity = 1;

    var table = document.getElementById("Leaderboard").style.visibility = "visible";
    var scoreTable = document.getElementById("score").style.visibility = "visible";
    
    fade(r);
    fade(table);
    fade(scoreTable);
    tick();
};

// Death response
function death(player_name) {
  //console.log('Kill: ' + player_name);
  for (var i in snakes) {
    if (snakes[i].name === my_name) {
      score = 0;
    }
    if (snakes[i].name === player_name) {
      snakes.splice(i,1);
    }
  }
}

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
    this.t = [Date.now()];
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

var interval = setInterval(increment,1000);

// Only for debugging. Do not use internalsend
function sendField() {
    var message = document.getElementById("sendbox").value;
    internalsend(message);
}

var frames = 0;

//if a mobile device is detected, move the canvas up so that there is room for buttons
//document.getElementById("gamecanvas").style.top = (((h - min) / 2)-50) + 'px';

// Resize
var w = window.innerWidth;
var h = window.innerHeight;
var min = w > h ? h : w;
var scale = min / 500;
// Set canvas size
document.getElementById("gamecanvas").width = min;
document.getElementById("gamecanvas").height = min;
// set bounds
document.getElementById("gamecanvas").style.position = "absolute";
document.getElementById("gamecanvas").style.left = ((w - min)/2) + 'px';
document.getElementById("gamecanvas").style.top = ((h - min)/2) + 'px';

window.addEventListener('resize', function() {
  // Sizing
  w = window.innerWidth;
  h = window.innerHeight;
  min = w > h ? h : w;
  scale = min / 500;
  // Set canvas size
  document.getElementById("gamecanvas").width = min;
  document.getElementById("gamecanvas").height = min;
  // set bounds
  document.getElementById("gamecanvas").style.position = "absolute";
  document.getElementById("gamecanvas").style.left = ((w - min)/2) + 'px';
  document.getElementById("gamecanvas").style.top = ((h - min)/2) + 'px';
  // Draw
  var canvas = document.getElementById('gamecanvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, min, min);
  }
});

// Draw
function draw() {
  frames++;
  document.getElementById("score").innerHTML = 'Score: ' + (score);
  var canvas = document.getElementById('gamecanvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, min, min);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, min, min);
    //ctx.fillStyle = 'white';
    for (var i in snakes) {
      // Glow
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = snakes[i].name == my_name ? '#2cfffb' : '#f3bc16';
      ctx.lineWidth = 15;
      ctx.beginPath();
      var last_x = snakes[i].x[0] * scale;
      var last_y = snakes[i].y[0] * scale;
      ctx.moveTo(last_x, last_y);
      for (var j in snakes[i].x) {
        var x_dif = last_x - snakes[i].x[j] * scale;
        var y_dif = last_y - snakes[i].y[j] * scale;
        if ( !(x_dif > 50 * scale || x_dif < -50 * scale || y_dif > 50 * scale || y_dif < -50 * scale) ) {
          ctx.lineTo(snakes[i].x[j] * scale, snakes[i].y[j] * scale);
        } else {
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(snakes[i].x[j] * scale, snakes[i].y[j] * scale);
        }
        last_x = snakes[i].x[j] * scale;
        last_y = snakes[i].y[j] * scale;
      }
      ctx.stroke();
      // Background
      ctx.globalAlpha = 1;
      ctx.strokeStyle = snakes[i].name == my_name ? '#2cfffb' : '#f3bc16';
      ctx.lineWidth = 7;
      ctx.beginPath();
      var last_x = snakes[i].x[0] * scale;
      var last_y = snakes[i].y[0] * scale;
      ctx.moveTo(last_x, last_y);
      for (var j in snakes[i].x) {
        var x_dif = last_x - snakes[i].x[j] * scale;
        var y_dif = last_y - snakes[i].y[j] * scale;
        if ( !(x_dif > 50 * scale || x_dif < -50 * scale || y_dif > 50 * scale || y_dif < -50 * scale) ) {
          ctx.lineTo(snakes[i].x[j] * scale, snakes[i].y[j] * scale);
        } else {
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(snakes[i].x[j] * scale, snakes[i].y[j] * scale);
        }
        last_x = snakes[i].x[j] * scale;
        last_y = snakes[i].y[j] * scale;
      }
      ctx.stroke();
      // Foreground
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.beginPath();
      var last_x = snakes[i].x[0] * scale;
      var last_y = snakes[i].y[0] * scale;
      ctx.moveTo(last_x, last_y);
      for (var j in snakes[i].x) {
        var x_dif = last_x - snakes[i].x[j] * scale;
        var y_dif = last_y - snakes[i].y[j] * scale;
        if ( !(x_dif > 50 * scale || x_dif < -50 * scale || y_dif > 50 * scale || y_dif < -50 * scale) ) {
          ctx.lineTo(snakes[i].x[j] * scale, snakes[i].y[j] * scale);
        } else {
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(snakes[i].x[j] * scale, snakes[i].y[j] * scale);
        }
        last_x = snakes[i].x[j] * scale;
        last_y = snakes[i].y[j] * scale;
      }
      ctx.stroke();
      // Draw name
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'white';
      ctx.font = "20px Comic Sans MS";
      ctx.fillText(snakes[i].name, (parseInt(snakes[i].x[snakes[i].x.length-1]) + 5) * scale, (parseInt(snakes[i].y[snakes[i].y.length-1]) - 5) * scale);
    }
  }
};

setInterval(function fps() {
  //document.getElementById("fps").innerHTML = 'Hz: ' + (frames);
  frames = 0;
}, 1000);

draw();
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

function mobileBtnLeft(){
    key = 'a';
}

function mobileBtnUp(){
    key = 'w';
}

function mobileBtnDown(){
    key = 's';
}

function mobileBtnRight(){
    key = 'd';
}

function submitBtnPress() {

    score = 0;

    var usrName = document.getElementById("UsernameInput").value;
    var usrPsswd = document.getElementById("UsernamePassword").value;

    if (usrName != "" && usrPsswd != "") {
        login(usrName, usrPsswd);
    } else{
        alert("You must enter username and password");
    }
}

//function to validate users password input
function checkPassword(userInput) {
    var validation = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return validation.test(userInput);
  }

function createBtnPress() {

    var createUsrName = document.getElementById("createUsernameInput").value;
    var createUsrPsswd = document.getElementById("createUsernamePassword").value;
    var confirmUsrPsswd = document.getElementById("confirmUsernamePassword").value;

    validationCheck = /^\w+$/;
    
    if(createUsrName != ""){
        if(!validationCheck.test(createUsrName)){
            alert("Username must contain only letters, numbers and underscores");
        }   
    }else{
       alert("Username cannot be left blank"); 
    }
    
    if(createUsrPsswd != confirmUsrPsswd || confirmUsrPsswd == ""){
        alert("Re-entered password MUST be the same as password");
    }
    
    if (createUsrPsswd != "" && confirmUsrPsswd == createUsrPsswd) {
        if(!checkPassword(createUsrPsswd)){
            alert("Password MUST contain at least one number/lowercase/uppercase letter and be at least 6 characaters in length");;
        }
        else{
            register(createUsrName, createUsrPsswd);
            alert("Username and Password are VALID");
        }
    }else{
        alert("Password cannot be left blank");
    }
}

function btnPress() {
    var s = document.getElementById("StartMenu").style;
    var r = document.getElementById("LoginMenu").style.visibility = "visible";

    fade(s);
}

function registerBtnPress() {

    var s = document.getElementById("LoginMenu").style.visibility = "hidden";
    var r = document.getElementById("RegistrationMenu").style.visibility = "visible";
}

function loginBtnPress() {

    var s = document.getElementById("RegistrationMenu").style.visibility = "hidden";
    var r = document.getElementById("LoginMenu").style.visibility = "visible";
}
