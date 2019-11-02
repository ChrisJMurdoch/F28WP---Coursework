
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

// Changeable validation method
var validation;

// Set validation method
exports.setValidation = function(method) {
  validation = method;
};

// On Connection
exports.connect = function (socket, req) {

  // Create connection state
  socket.responding = true;
  var state = ONLINE;
  var username = 'DefaultUsername';

  // Log connection
  console.log(req.connection.remoteAddress, ' ~ CONNECTED.\n');

  // On message recieved
  socket.on('message', function incoming(message) {
    // Log message
    console.log(req.connection.remoteAddress,' > ', message);
    // Process
    switch (state) {
      case ONLINE:
        unverifiedDetermine(message, socket);
        console.log();
        break;
      case VERIFIED:
        verifiedDetermine(message, socket);
        console.log();
        break;
    }
  });

  // On ping response
  socket.on('pong', function response() {
    socket.responding = true;
  });

  // On close
  socket.on('close', function close() {
    console.log(socket._socket.remoteAddress, ' >< TERMINATED.\n');
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
        // Try to verify
        if (validation(primarydata, secondarydata)) {
          console.log('VERIFY SUCCESS.');
          state = VERIFIED;
          username = primarydata;
          send(PLAINTEXT, 'Hello ' + username + '. You are now logged in.');
        } else {
          console.log('VERIFY FAILURE.');
          send(PLAINTEXT, 'Verification failed.');
        }
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
        console.log('COORDS.');
        excludingbroadcast(SERVER_TO_CLIENT_COORDS, username + ';' + primarydata + ';' + secondarydata);
        send(PLAINTEXT, 'Co-ords received.');
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
};
