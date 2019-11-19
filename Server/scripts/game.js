
const TICK_PERIOD = 10; // in milliseconds

// INTERFACES
// Check if player exists
exports.has_player = function(in_name) {
  for(var i in players){
    if ( players[i].name === in_name ) {
     return true;
    }
  }
  return false;
};

// Add player to game and return reference
exports.add_player = function(in_name) {
  var player = new Player(in_name);
  players.push(player);
  return player;
};

// Create and push a request to the processing queue
exports.move = function(player, in_x, in_y, in_socket) {
  queue.push(new UpdateReq(player, parseInt(in_x), parseInt(in_y), in_socket));
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
var load = [];
exports.start = function() {
  setInterval(function run() {
    var start_time = Date.now();
    for (var i in queue) {
      if (queue.length > 0) {
        req = queue.shift();
        var last = req.player.time;
        req.player.time = Date.now();
        var elapsed = req.player.time - last;
        req.player.x += req.x * elapsed / 10;
        req.player.y += req.y * elapsed / 10;
        if (req.player.x < 0) {
          req.player.x = 500;
        } else if (req.player.x > 500) {
          req.player.x = 0;
        }
        if (req.player.y < 0) {
          req.player.y = 500;
        } else if (req.player.y > 500) {
          req.player.y = 0;
        }
        //console.log(req.player);
        //console.log();
        pull_update(req.soc, req.player);
      }
    }
    var duration = Date.now() - start_time;
    load.push(duration);
    if (load.length > 200) {
      load.shift();
    }
  }, TICK_PERIOD);
};

setInterval(function dis() {
  var av = 0;
  for (var i in load) {
    av += load[i];
  }
  av /= load.length;
  // console.log('SERVER LOAD: ' + Math.floor(av / TICK_PERIOD * 100) + '%');
}, 1000);

// PRIVATE METHODS

// Get player data
pull_update = function(in_socket, in_player) {
  var response = '4';
  for (var i in players) {
    var s = ';' + players[i].name + '@' + Math.floor(players[i].x) + '@' + Math.floor(players[i].y);
    response = response + s;
  }
  in_socket.send(response);
};

var players = [];
var queue = [];

class UpdateReq {
  constructor (in_player, in_x, in_y, in_socket) {
    this.player = in_player;
    this.x = in_x;
    this.y = in_y;
    this.soc = in_socket;
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
