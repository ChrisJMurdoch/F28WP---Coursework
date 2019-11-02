
// Modules
const ws = require('ws');
const socket_handler = require('./socket');

// Start server
exports.initialise = function (settings, verification_agent) {

  // Initialise server on port
  console.log('SERVER STARTING...');
  const server = new ws.Server({ port: settings.port });
  console.log('SERVER INITIALISED ON PORT ' + settings.port + '.\n');

  // Drop unresponsive connections on a regular basis
  console.log('STARTING HEARTBEAT...');
  const interval = setInterval(function monitor() {
    server.clients.forEach(function each(socket) {
      if (!socket.responding) {
        console.log(socket._socket.remoteAddress, ' >< TERMINATED.\n');
        return socket.terminate();
      } else {
        if (settings.show_heartbeat) console.log(socket._socket.remoteAddress, ' <> HEARTBEAT.\n');
      }
      socket.responding = false;
      socket.ping();
    });
  }, settings.heartbeat_frequency);
  console.log('HEARTBEAT STARTED.\n');

  // Setup socket handler
  socket_handler.setValidation(verification_agent.verify);
  server.on('connection', socket_handler.connect);
};
