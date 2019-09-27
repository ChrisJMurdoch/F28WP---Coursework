
// Use ws module
const WebSocket = require('ws');

// Initialise socket on local port 8001
const socket = new WebSocket.Server({ port: 8001 });

// On successful connection
socket.on('connection', function connection(connection) {

  // On message recieved
  connection.on('message', function incoming(message) {
    console.log('Incoming from:', connection._socket.remoteAddress,': ', message);
    send(message);
  });

  function send(message) {
    console.log('Outgoing: ', message.toUpperCase());
    connection.send(message.toUpperCase());
  }

});
