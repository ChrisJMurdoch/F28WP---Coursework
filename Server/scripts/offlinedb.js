
// This module is a backup to continue testing the server when our database is acting up serverside

// Dummy users
var user_array = ['Chris', 'Cameron', 'Olubi', 'Joe', 'Admin', 'a', 'b', 'c', 'd', 'e'];

// Connect to database
exports.connect = function(DB_DATA, callback) {
  // Create connection
  console.log("DUMMY CONNECT.");
  callback();
};

// Database validation
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
    console.log(user_array[i]);
  }
};

// Add users
exports.add_user = function(username, password) {
  // DUMMY ADD
};
