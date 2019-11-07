
// Client connection states
const OFFLINE = 0;
const ONLINE = 1;
const VERIFIED = 2;

// Action codes
const PLAINTEXT = '0';
const REGISTER = '1';
const LOGIN = '2';
const CLIENT_TO_SERVER_COORDS = '3';
const SERVER_TO_CLIENT_COORDS = '4';
const LOGIN_SUCCESS = '5';

// Variables
var settings;
var database;
var server;
var game;

// Startup
exports.initialise = function(sett, db, serv, gm) {
  settings = sett;
  database = db;
  server = serv;
  game = gm;
};

// On Connection
exports.connect = function (socket, req) {

  // Log connection
  console.log(req.connection.remoteAddress, ' ~ CONNECTED.\n');

  // Create connection state
  socket.responding = true;
  var state = ONLINE;
  var username = 'DefaultUsername';
  var player;

  // Keep connection
  console.log('STARTING HEARTBEAT...');
  var hb_monitor = setInterval(function monitor() {
    if (!socket.responding) {
      console.log(socket._socket.remoteAddress, ' >< TERMINATED.\n');
      if (state === VERIFIED) {
        game.remove_player(player);
      }
      clearInterval(hb_monitor);
      socket.terminate();
      return;
    } else {
      if (settings.show_heartbeat) console.log(socket._socket.remoteAddress, ' <> HEARTBEAT.\n');
    }
    socket.responding = false;
    socket.ping();
  }, settings.heartbeat_frequency);
  console.log('HEARTBEAT STARTED.\n');

  // On message recieved
  socket.on('message', function incoming(message) {
    // Log message
    //console.log(req.connection.remoteAddress,' > ', message);
    // Process
    switch (state) {
      case ONLINE:
        unverifiedDetermine(message, socket);
        //console.log();
        break;
      case VERIFIED:
        verifiedDetermine(message, socket);
        //console.log();
        break;
    }
  });

  // On ping response
  socket.on('pong', function response() {
    socket.responding = true;
  });

  // On close
  socket.on('close', function close() {
    console.log(socket._socket.remoteAddress, ' >< TERMINATED C.\n');
    if (state === VERIFIED) {
      game.remove_player(player);
    }
    clearInterval(hb_monitor);
  });

  // Generate action for unverified state
  function unverifiedDetermine(message, sender) {
    var splitmessage = message.split(';');
    var actioncode = splitmessage[0];
    var primarydata = splitmessage[1];
    var secondarydata = splitmessage[2];
    switch (actioncode) {
      case PLAINTEXT:
        console.log('PLAINTEXT BLOCKED.');
        send(PLAINTEXT, 'Log in to send messages.');
        break;
      case REGISTER:
        console.log('REGISTERING NOT AVAILABLE YET.');
        send(PLAINTEXT, 'Not available yet.');
        break;
      case LOGIN:
        console.log('VERIFY PENDING...');
        validate(primarydata, secondarydata);
        break;
      case CLIENT_TO_SERVER_COORDS:
        console.log('UNVERIFIED COORDS.');
        send(PLAINTEXT, 'Please log in first.');
        break;
      default:
        console.log('INVALID ACTION CODE.');
        send(PLAINTEXT, 'Invalid response received.');
        break;
    }
  };

  // Generate action for verified state
  function verifiedDetermine(message, sender) {
    var splitmessage = message.split(';');
    var actioncode = splitmessage[0];
    var primarydata = splitmessage[1];
    var secondarydata = splitmessage[2];
    switch (actioncode) {
      case PLAINTEXT:
        console.log('PLAINTEXT BROADCAST.');
        broadcast(PLAINTEXT, username + ': ' + primarydata);
        break;
      case REGISTER:
        console.log('CANT REGISTER WHILE LOGGED IN.');
        send(PLAINTEXT, 'Log out before registering.');
        break;
      case LOGIN:
        console.log('ALREADY LOGGED IN.');
        send(PLAINTEXT, 'You are already logged in.');
        break;
      case CLIENT_TO_SERVER_COORDS:
        //console.log('COORDS.');
        game.move(player, primarydata, secondarydata);
        game.pull_update(socket, player);
        break;
      default:
        console.log('INVALID ACTION CODE.');
        send(PLAINTEXT, 'Invalid response received.');
        break;
    }
  };

  // Send message
  function send(type, message) {
    console.log(req.connection.remoteAddress, ' < ', message);
    socket.send(type + ';' + message);
  };

  // Send to all
  function broadcast(type, message) {
    console.log('ALL < ', message);
    server.clients.forEach(function(client) {
      client.send(type + ';' + message);
    });
  };

  // Send to all but self
  function excludingbroadcast(type, message) {
    console.log('ALL < ', message);
    server.clients.forEach(function(client) {
      if (client !== socket) {
        client.send(type + ';' + message);
      }
    });
  };

  // Validate using database
  validate = function(uname, password) {
    database.verify(uname, password, function(result) {
      if (result) {
        state = VERIFIED;
        username = uname;
        console.log('VERIFY SUCCESS.');
        send(LOGIN_SUCCESS, 'Hello ' + username + ', you are now logged in.');
        player = game.add_player(username);
        console.log();
      } else {
        console.log('VERIFY FAILURE.');
        send(PLAINTEXT, 'Log in failed.');
        console.log();
      }
    });
  };
};
