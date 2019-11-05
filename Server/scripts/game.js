
// INTERFACES

// Add player to game and return reference
exports.add_player = function(in_name) {
  var player = new Player(in_name);
  players.push(player);
  return player;
};

// Create and push a request to the processing queue
exports.move = function(player, in_x, in_y) {
  queue.push(new UpdateReq(player, parseInt(in_x), parseInt(in_y)));
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
exports.remove_player = function(in_player) {
  for(var i in players){
    if ( players[i] === in_player ) {
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
        var last = req.player.time;
        req.player.time = Date.now();
        var elapsed = req.player.time - last;
        req.player.x += req.x * elapsed / 10;
        req.player.y += req.y * elapsed / 10;
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
    this.time = Date.now();
  };
};
