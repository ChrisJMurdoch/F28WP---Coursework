
// Modules
const mysql = require("mysql");

// Connection
var db_connection;

// Connect to database
exports.connect = function(DB_DATA, callback) {
  // Create connection
  db_connection = mysql.createConnection(DB_DATA);
  // Start connection
  console.log("CONNECTING TO DATABASE...");
  db_connection.connect(function(err) {
    if (err) throw err;
    console.log("CONNECTION TO DATABASE ESTABLISHED.\n");
    callback();
  });
};

// Database validation
exports.verify = function(username, password, callback) {
  user(username, function(result) {
    callback(result != undefined && result.password === password);
  });
};

// Display database users
exports.print_users = function() {
  users(function(result) {
    for (var i in result) {
      console.log(result[i].userName + ' ' + result[i].password);
    }
    console.log();
  });
};

// Add users
exports.add_user = function(username, password) {
  var sql = "INSERT INTO Users (userName, password) VALUES ?";
  var user = [[username, password]];
  db_connection.query(sql, [user], function (error, results) {
    if (error) throw error;
    console.log("Number of records inserted: " + results.affectedRows + "\n");
  });
};

// Get user
user = function (username, callback) {
  var sql = 'SELECT * FROM `Users` WHERE `userName` = ?';
  db_connection.query(sql, username, function(error, results) {
    callback(results[0]);
  });
};

// Get all users
users = function (callback) {
  var sql = 'SELECT * FROM `Users`';
  db_connection.query(sql, function(error, results) {
    callback(results);
  });
};
