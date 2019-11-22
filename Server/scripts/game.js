var socket_handler = require('./socket_handler');

// Intersect helper
function hasIntersection( x1, y1, x2, y2, x3, y3, x4, y4 ) {

  if (Math.abs(x1-x2) > 50 || Math.abs(x3-x4) > 50 || Math.abs(y1-y2) > 50 || Math.abs(y3-y4) > 50) {
    return false;
  }

  var firstvert = x1 === x2;
  var secondvert = x3 === x4;

  if (firstvert === secondvert) { // Parralel
    return false;
  }

  if (!firstvert) {
    var xs = (x1<x3 && x3<x2) || (x2<x3 && x3<x1);
    var ys = (y3<y1 && y1<y4) || (y4<y1 && y1<y3);
    return ( xs ) && ( ys );
  } else {
    var xs = (x3<x1 && x1<x4) || (x4<x1 && x1<x3)
    var ys = (y1<y3 && y3<y2) || (y2<y3 && y3<y1)
    return ( xs ) && ( ys );
  }
}
const TICK_PERIOD = 10; // in milliseconds

// INTERFACES
// Check if player exists
exports.has_player = function(in_name) {
  for(var i in players) {
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
    if ( players[i].name === in_player.name ) {
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
        //req.player.x += req.x * elapsed / 10;
        //req.player.y += req.y * elapsed / 10;
        req.player.x.push(req.player.x[req.player.x.length-1] + req.x * elapsed / 10);
        req.player.y.push(req.player.y[req.player.y.length-1] + req.y * elapsed / 10);
        req.player.t.push(Date.now());
        if (req.player.x[req.player.x.length-1] < 0) {
          req.player.x[req.player.x.length-1] = 500;
        } else if (req.player.x[req.player.x.length-1] > 500) {
          req.player.x[req.player.x.length-1] = 0;
        }
        if (req.player.y[req.player.y.length-1] < 0) {
          req.player.y[req.player.y.length-1] = 500;
        } else if (req.player.y[req.player.y.length-1] > 500) {
          req.player.y[req.player.y.length-1] = 0;
        }
        /*
        if (req.player.x.length > 100) {
          req.player.x.shift();
          req.player.y.shift();
        }
        */
        var time = Date.now();
        while (true) {
          if (time - req.player.t[0] > 2000) {
            req.player.t.shift();
            req.player.x.shift();
            req.player.y.shift();
          } else {
            break;
          }
        }
        //start
        // Collision detection
        if (req.player.x.length <=1) {
          continue;
        }
        outer: for (var player in players) {
          if (players[player].x.length <=1) {
            continue;
          }
          //if (players[player].name === req.player.name) {
          //  continue;
          //}
          for (var point in players[player].x) {
            if (hasIntersection(
              req.player.x[req.player.x.length-1],
              req.player.y[req.player.y.length-1],
              req.player.x[req.player.x.length-2],
              req.player.y[req.player.y.length-2],
              players[player].x[point],
              players[player].y[point],
              players[player].x[point-1],
              players[player].y[point-1]
            )) {
              console.log('Collision!');
              // Remove clientside
              socket_handler.broadcast('6;' + req.player.name)
              // Remove serverside
              module.exports.remove_player(req.player);
              var n = new Player(req.player.name);
              players.push(n);
              req.soc.player = n;
              break outer;
            }
          }
        }
        // End collision detection
        //end
        pull_update(req.soc, req.player);
      }
    }
    var duration = Date.now() - start_time;
    load.push(duration);
    if (load.length > 100) {
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
    var s = ';' + players[i].name + '@' + Math.floor(players[i].x[players[i].x.length-1]) + '@' + Math.floor(players[i].y[players[i].y.length-1]);
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
    this.x = [Math.floor(Math.random() * 500)];
    this.y = [Math.floor(Math.random() * 500)];
    this.t = [Date.now()];
    this.time = Date.now();
  };
};
