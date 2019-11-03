
// INTERFACES

// Add player to game
exports.add_player = function(in_name) {
  players.push(new Player(in_name));
};

// CoOrds
exports.update = function(in_name, in_x, in_y) {
  queue.push(new UpdateReq(in_name, in_x, in_y));
};

// Remove player from game
exports.remove_player = function(in_name) {
  for(var i in players){
    if ( players[i].name === in_name ) {
     players.splice(i, 1);
    }
  }
};

// Display
exports.print = function() {
  for (var i in players) {
    console.log(players[i].name + ' ' + players[i].x + ' ' + players[i].y);
  }
};

// Main loop
exports.start = function() {
  setInterval(function run() {
    if (queue.length > 0) {
      req = queue.shift();
      for (var i in players) {
        if (players[i].name === req.name) {
          console.log(players[i]);
          players[i].x = req.x;
          players[i].y = req.y;
          console.log(players[i]);
          console.log();
        }
      }
    }
  }, 33);
};

// PRIVATE METHODS

var players = [];
var queue = [];

function Player(in_name) {
  this.name = in_name;
  this.x = Math.floor(Math.random() * 100);
  this.y = Math.floor(Math.random() * 100);
};

function UpdateReq(in_name, in_x, in_y) {
  this.name = in_name;
  this.x = in_x;
  this.y = in_y;
};
