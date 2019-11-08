
// Modules
const mysql = require("mysql");

// Connection
var db_connection;

// Connect to database
exports.connect = function(DB_DATA, callback) {
  // Create connection
  console.log("DUMMY CONNECT.");
  callback();
};

// Database validation
var user_array = ['Chris', 'Cameron', 'Olubi', 'Joe', 'Admin', 'a', 'b', 'c', 'd', 'e'];
exports.verify = function(username, password, callback) {
  for (var i in user_array) {
    if (user_array[i] === username && password === 'abc') {
      callback(true);
      return;
    }
  }
  callback(false);
};

// Display database users
exports.print_users = function() {
  for (var i in user_array) {
    console,log(user_array[i]);
  }
};

// Add users
exports.add_user = function(username, password) {
  console.log("DUMMY ADD.")
};
