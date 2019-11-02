
// Modules
const server = require('./server');
const database = require('./database');

// Settings
const SERV_DATA = {
  port: 8001,
  show_heartbeat: true,
  heartbeat_frequency: 3000
};
const DB_DATA = {
  host: "remotemysql.com",
  user: "c1uDVliS0M",
  password: "APlVfT4Lwj",
  database: "c1uDVliS0M"
};

// Start server
server.initialise(SERV_DATA, database);

// Start database connection
database.connect(DB_DATA);

// Verify
database.verify('Chris Murdoch', 'cm', function (result) {
  console.log(result);
});
