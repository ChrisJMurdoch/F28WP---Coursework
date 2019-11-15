
// Modules
const mysql = require("mysql");

// Connection
var db_connection;

// Connect to database
exports.connect = function(DB_DATA, callback) {
  // Create connection
  db_connection = mysql.createConnection(DB_DATA);
  // Start connection
  console.log("CONNECTING TO POINTER DATABASE...");
  db_connection.connect(function(err) {
    if (err) throw err;
    console.log("CONNECTION TO POINTER DATABASE ESTABLISHED.\n");
    callback();
  });
};

// Update database ip_pointer to current IP
exports.set_pointer = function() {
  // TODO
};
