
// Use ws module
const Webserver = require('ws');

// Connection states
const OFFLINE = 0;
const ONLINE = 1;
const VERIFIED = 2;

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
        // Try to verify
        if (verify(message)) {
          console.log('VERIFY SUCCESS.');
          state = VERIFIED;
          username = message;
          send('Hello ' + username + '. You are now logged in.');
        } else {
          console.log('VERIFY FAILURE.');
          send('Verification failed.');
        }
        console.log();
        break;
      case VERIFIED:
        // Echo
        console.log('BROADCAST.');
        broadcast(message);
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

  // Send message
  function send(message) {
    console.log(req.connection.remoteAddress, ' < ', message);
    socket.send(message);
  }

  // Send to all but self
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
