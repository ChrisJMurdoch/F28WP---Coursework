
// INTERFACES

// Add player to game and return reference
exports.add_player = function(in_name) {
  var player = new Player(in_name);
  players.push(player);
  return player;
};

// Create and push a request to the processing queue
exports.update = function(player, in_x, in_y) {
  queue.push(new UpdateReq(player, in_x, in_y));
};

// Get player data
exports.pull_update = function(in_socket, in_player) {
  var response = '4';
  for (var i in players) {
    var s = ';' + players[i].name + '@' + players[i].x + '@' + players[i].y;
    response = response + s;
  }
  in_socket.send(response);
};

// Remove player from game
exports.remove_player = function(in_name) {
  for(var i in players){
    if ( players[i].name === in_name ) {
     players.splice(i, 1);
    }
  }
};

// Main loop
exports.start = function() {
  setInterval(function run() {
    for (var i in queue) {
      if (queue.length > 0) {
        req = queue.shift();
        req.player.x = req.x;
        req.player.y = req.y;
        console.log(req.player);
        console.log();
      }
    }
  }, 10);
};

// PRIVATE METHODS

var players = [];
var queue = [];

class UpdateReq {
  constructor (in_player, in_x, in_y) {
    this.player = in_player;
    this.x = in_x;
    this.y = in_y;
  };
};

class Player {
  constructor(in_name) {
    this.name = in_name;
    this.x = Math.floor(Math.random() * 100);
    this.y = Math.floor(Math.random() * 100);
  };
};
