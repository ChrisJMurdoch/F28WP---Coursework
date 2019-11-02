
// Modules
const server = require('./server');
const database = require('./database');

// Settings
const SERV_DATA = {
  port: 8001,
  show_heartbeat: false,
  heartbeat_frequency: 3000
};
const DB_DATA = {
  host: "remotemysql.com",
  user: "c1uDVliS0M",
  password: "APlVfT4Lwj",
  database: "c1uDVliS0M"
};

// Start database connection
database.connect(DB_DATA, function() {

  // Start server
  server.initialise(SERV_DATA, database);

  // Verify
  database.verify('Chris Murdoch', 'cm', function(success) {
    console.log('Verified: ' + success + '\n');
  });

  // Print users
  database.print_users();

});
