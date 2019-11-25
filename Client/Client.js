
// SOCKET INTERFACE METHODS

// Action codes // Keep synced with server codes
const PLAINTEXT = '0';
const REGISTER = '1';
const LOGIN = '2';
const CLIENT_TO_SERVER_COORDS = '3';
const SERVER_TO_CLIENT_COORDS = '4';
const LOGIN_SUCCESS = '5';
const DEATH = '6';
const LEADERBOARD = '7';

// Player name
var my_name;
// Player score
var score = 0;
// All drawable players
var snakes = [];
// Last key pressed
var key = 'w';

// Create WebSocket
const socket = new WebSocket('ws://f28wp.herokuapp.com/:80'); // Heroku

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
          alert(primarydata);
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



// SERVER RESPONSES

// Receive Co-ordinates
function oncoords(data) {
  // For each incoming player co-ord
  outer: for (var i in data) {
    var split_data = data[i].split('@');
    // Find player
    for (var s in snakes) {
      if (snakes[s].name === split_data[0]) {
        // Push new timestamped body part
        snakes[s].x.push(split_data[1]);
        snakes[s].y.push(split_data[2]);
        snakes[s].t.push(Date.now());
        // Remove body parts older than 2 seconds
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
    // Create new player record if not found
    snakes.push(new Snake(split_data[0], split_data[1], split_data[2]));
  }
  // Remove players excluded from broadcast (logged out)
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

// Login response
function login_response(message) {
    console.log(message);
    // Swap login menu for leaderboard and score
    document.getElementById("Leaderboard").style.visibility = "visible";
    document.getElementById("score").style.visibility = "visible";
    fade(document.getElementById("LoginMenu").style);
    tick();
};

// Death response
function death(player_name) {
  // Reset score if this player
  if (player_name === my_name) {
    score = 0;
  }
  // Remove player
  for (var i in snakes) {
    if (snakes[i].name === player_name) {
      snakes.splice(i,1);
    }
  }
}

// Update leaderboard
function leaderboard(data) {
  table = document.getElementById('leaderboard');
  table.rows[2].cells[1].innerHTML = data[0].split('#')[0];
  table.rows[3].cells[1].innerHTML = data[1].split('#')[0];
  table.rows[4].cells[1].innerHTML = data[2].split('#')[0];
  table.rows[2].cells[2].innerHTML = data[0].split('#')[1];
  table.rows[3].cells[2].innerHTML = data[1].split('#')[1];
  table.rows[4].cells[2].innerHTML = data[2].split('#')[1];
};



// CLIENT TO SERVER METHODS

// Send raw data
function internalsend(message) {
    socket.send(message);
    // Save username
    if (message.split(';')[0] == LOGIN) {
      my_name = message.split(';')[1];
    }
};

// Send text message to all
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

// Function to fade div elements
function fade(element){
    element.opacity = 1;
    (element.opacity -= .1 < 0) ? element.display = "none" : setTimeout(fade, 40);
}

// Create movement vector and send to server
function tick() {
  var x_out = 0;
  var y_out = 0;
  switch (key) {
    case 'w':
      y_out--;
      break;
    case 'a':
      x_out--;
      break;
    case 's':
      y_out++;
      break;
    case 'd':
      x_out++;
      break;
  }
  sendcoords(x_out , y_out);
};

// Increment score each second
var interval = setInterval(function() {
  score += 1;
  document.getElementById("score").innerHTML = 'Score: ' + (score);
},1000);

// Resize canvas
var w = window.innerWidth;
var h = window.innerHeight;
var min = w > h ? h : w;
var scale = min / 500;
// Set canvas size
document.getElementById("gamecanvas").width = min;
document.getElementById("gamecanvas").height = min;
// Set bounds
document.getElementById("gamecanvas").style.position = "absolute";
document.getElementById("gamecanvas").style.left = ((w - min)/2) + 'px';
document.getElementById("gamecanvas").style.top = ((h - min)/2) + 'px';

// Resize canvas on window resize
window.addEventListener('resize', function() {
  // Sizing
  w = window.innerWidth;
  h = window.innerHeight;
  min = w > h ? h : w;
  scale = min / 500;
  // Set canvas size
  document.getElementById("gamecanvas").width = min;
  document.getElementById("gamecanvas").height = min;
  // Set bounds
  document.getElementById("gamecanvas").style.position = "absolute";
  document.getElementById("gamecanvas").style.left = ((w - min)/2) + 'px';
  document.getElementById("gamecanvas").style.top = ((h - min)/2) + 'px';
  // Redraw background
  var canvas = document.getElementById('gamecanvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, min, min);
  }
});

// Render game
function draw() {
  var canvas = document.getElementById('gamecanvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, min, min);
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, min, min);
    // Draw each snake
    for (var i in snakes) {
      // Draw in parts
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
      // Highlight
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
      ctx.font = "20px Bungee";
      ctx.fillText(snakes[i].name, (parseInt(snakes[i].x[snakes[i].x.length-1]) + 5) * scale, (parseInt(snakes[i].y[snakes[i].y.length-1]) - 5) * scale);
    }
  }
};
// Draw when loaded
draw();

// Key listener
document.onkeydown = function (e) {
  switch(e.code) {
    case 'KeyW' :
      if (key != 's')
        key = 'w';
      break;
    case 'KeyA' :
      if (key != 'd')
        key = 'a';
      break;
    case 'KeyS' :
      if (key != 'w')
        key = 's';
      break;
    case 'KeyD' :
      if (key != 'a')
        key = 'd';
      break;
  }
};

// Button listeners
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

// Login
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

// Function to validate users password input
function checkPassword(userInput) {
  var validation = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  return validation.test(userInput);
}

// Register
function createBtnPress() {
    var createUsrName = document.getElementById("createUsernameInput").value;
    var createUsrPsswd = document.getElementById("createUsernamePassword").value;
    var confirmUsrPsswd = document.getElementById("confirmUsernamePassword").value;
    validationCheck = /^\w+$/;
    if(createUsrName != "") {
        createUsrName.trim();
        if(!validationCheck.test(createUsrName)) {
            alert("Username MUST contain only letters, numbers and underscores. Username CANNOT contain spaces");
        }
    } else {
       alert("Username CANNOT be left blank");
    }
    if (createUsrPsswd != confirmUsrPsswd || confirmUsrPsswd == "") {
        alert("Re-entered password MUST be the same as password");
    }
    if (createUsrPsswd == "" || confirmUsrPsswd == "") {
        alert("Password CANNOT be left blank")
    }
    if (createUsrPsswd != "" && confirmUsrPsswd == createUsrPsswd) {
        createUsrPsswd.trim();
        confirmUsrPsswd.trim();
        if (!checkPassword(createUsrPsswd)) {
            alert("Password MUST contain at least one number/lowercase/uppercase letter and be at least 6 characaters in length");;
        }
        else{
            if(checkPassword(createUsrPsswd) && validationCheck.test(createUsrName)){
                register(createUsrName, createUsrPsswd);
            }
        }
    }
}

// Go to login menu
function btnPress() {
    document.getElementById("LoginMenu").style.visibility = "visible";
    fade(document.getElementById("StartMenu").style);
}

// Go to register menu
function registerBtnPress() {
    document.getElementById("LoginMenu").style.visibility = "hidden";
    document.getElementById("RegistrationMenu").style.visibility = "visible";
}

// Hide login menu
function loginBtnPress() {
    document.getElementById("RegistrationMenu").style.visibility = "hidden";
    document.getElementById("LoginMenu").style.visibility = "visible";
}



// CLASSES

class Snake {
  constructor(in_name, in_x, in_y) {
    this.name = in_name;
    this.x = [in_x];
    this.y = [in_y];
    this.t = [Date.now()];
  };
};
