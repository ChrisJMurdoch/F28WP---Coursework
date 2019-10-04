
// Use ws module
const Webserver = require('ws');

// Connection states
const OFFLINE = 0;
const ONLINE = 1;
const VERIFIED = 2;

// Action codes
const REGISTER = '0';
const LOGIN = '1';
const SEND_COORDS = '2';


// Users
const users = new Set(["Admin","Chris","Cameron","Joe","Olubi"]);

// Initialise server on local port 8001
const PORT = 8001;
const server = new Webserver.Server({ port: PORT });
console.log('SERVER INITIALISED ON PORT ', PORT, '\n');

// SOCKET CODE

server.on('connection', function connection(socket, req) {

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

  // Generate action for verified state
  function verifiedDetermine(message, sender) {
    var splitmessage = message.split(';');
    var actioncode = splitmessage[0];
    var primarydata = splitmessage[1];
    var secondarydata = splitmessage[2];
    switch (actioncode) {
      case REGISTER:
        console.log('CANT REGISTER WHILE LOGGED IN.');
        send('Log out before registering.');
        break;
      case LOGIN:
        console.log('ALREADY LOGGED IN.');
        send('You are already logged in.');
        break;
      case SEND_COORDS:
        console.log('COORDS.');
        // DO SOMETHING
        send('Co-ords received.');
        break;
      default:
        console.log('INVALID ACTION CODE.');
        send('Invalid response received.');
        break;
    }
  }

  // Generate action for unverified state
  function unverifiedDetermine(message, sender) {
    var splitmessage = message.split(';');
    var actioncode = splitmessage[0];
    var primarydata = splitmessage[1];
    var secondarydata = splitmessage[2];
    switch (actioncode) {
      case REGISTER:
        console.log('REGISTERING NOT AVAILABLE YET.');
        send('Not available yet.');
        break;
      case LOGIN:
        // Try to verify
        if (verify(primarydata)) {
          console.log('VERIFY SUCCESS.');
          state = VERIFIED;
          username = primarydata;
          send('Hello ' + username + '. You are now logged in.');
        } else {
          console.log('VERIFY FAILURE.');
          send('Verification failed.');
        }
      break;
      case SEND_COORDS:
        console.log('UNVERIFIED COORDS.');
        send('Please log in first.');
        break;
      default:
        console.log('INVALID ACTION CODE.');
        send('Invalid response received.');
        break;
    }
  }

  // Send message
  function send(message) {
    console.log(req.connection.remoteAddress, ' < ', message);
    socket.send(message);
  }

  // Send to all
  function broadcast(message) {
    console.log('ALL < ', message);
    server.clients.forEach(function(client) {
      client.send(username + ': ' + message);
    });
  }

});

// SERVER CODE

const SHOW_HEARTBEAT = false;

const interval = setInterval(function monitor() {
  server.clients.forEach(function each(socket) {
    if (!socket.responding) {
      console.log(socket._socket.remoteAddress, ' >< TERMINATED.\n');
      return socket.terminate();
    } else {
      if (SHOW_HEARTBEAT) console.log(socket._socket.remoteAddress, ' <> HEARTBEAT.\n');
    }
    socket.responding = false;
    socket.ping();
  });
}, 5000);

function verify(message) {
  return (users.has(message));
}
