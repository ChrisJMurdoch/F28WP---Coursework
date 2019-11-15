
// Modules
const pointerdb = require('./pointerdb.js')
const database = require('./database');
//const database = require('./offlinedb');
const ws = require('ws');
const socket_handler = require('./socket_handler');
const game = require('./game');

// Settings
const SERV_DATA = {
  port: 8001,
  show_heartbeat: false,
  heartbeat_frequency: 3000
};
const PTR_DATA = {
  host: "remotemysql.com",
  user: "O9d2rw2TGv",
  password: "zJxaDPVl7p",
  database: "O9d2rw2TGv"
};
const DB_DATA = {
  host: "remotemysql.com",
  user: "c1uDVliS0M",
  password: "APlVfT4Lwj",
  database: "c1uDVliS0M"
};

// Set server pointer
pointerdb.connect(PTR_DATA, function() {
  pointerdb.set_pointer();
});

// Start database connection // Can safely be done before pointerdb.connect() callback
database.connect(DB_DATA, function() {

  // Start server
  console.log('SERVER STARTING...');
  const server = new ws.Server({ port: SERV_DATA.port });
  console.log('SERVER INITIALISED ON PORT ' + SERV_DATA.port + '\n');

  // Setup socket handler
  socket_handler.initialise(SERV_DATA, database, server, game)
  server.on('connection', socket_handler.connect);

  // Run
  game.start();

});
