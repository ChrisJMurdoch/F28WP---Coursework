
// MODULES /////////////////
const ws = require('ws');
const mysql = require('mysql');
const socket_handler = require('./socket');



// SETTINGS /////////////////

// Console settings
const PORT = 8001;
const HEARTBEAT_FREQUENCY = 3000;
const SHOW_HEARTBEAT = false;
const DB_DATA = {
  host: "remotemysql.com",
  user: "Vy4bu9NFZV",
  password: "uvriKeVAEb"
};



// SERVER CODE /////////////////

// Initialise server on port 8001
console.log('SERVER STARTING...');
const server = new ws.Server({ port: PORT });
console.log('SERVER INITIALISED ON PORT ' + PORT + '.\n');

// Drop unresponsive connections on a regular basis
console.log('STARTING HEARTBEAT...');
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
}, HEARTBEAT_FREQUENCY);
console.log('HEARTBEAT STARTED.\n');

// Users
const users = new Set(["Admin","Chris","Cameron","Joe","Olubi"]);
// Dummy validation
const verify = function(username, password) {
  return (users.has(username) && password === 'admin');
}

// Setup socket handler
server.on('connection', socket_handler.connect);
socket_handler.setValidation(verify);



// DATABASE CODE /////////////////

// Create connection
const db_connection = mysql.createConnection(DB_DATA);

// Start connection
console.log("CONNECTING TO DATABASE...");
db_connection.connect(function(err) {
  if (err) throw err;
  console.log("CONNECTION TO DATABASE ESTABLISHED.\n");
});
