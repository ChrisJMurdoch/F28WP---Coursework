
// INTERFACES

// Add player to game
exports.add_player = function(in_name) {
  var player = new Player(in_name);
  players.push(player);
  return player;
};

// Update position
exports.update = function (player, in_x, in_y) {
  queue.push(new UpdateReq(player, in_x, in_y));
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
    if (queue.length > 0) {
      req = queue.shift();
      req.player.x = req.x;
      req.player.y = req.y;
      console.log(req.player);
      console.log();
    }
  }, 33);
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
