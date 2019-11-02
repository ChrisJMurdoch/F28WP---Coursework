
// Modules
const mysql = require('mysql');

// Connect to database
exports.connect = function(DB_DATA) {
  // Create connection
  db_connection = mysql.createConnection(DB_DATA);
  // Start connection
  console.log("CONNECTING TO DATABASE...");
  db_connection.connect(function(err) {
    if (err) throw err;
    console.log("CONNECTION TO DATABASE ESTABLISHED.\n");
  });
};

// Dummy validation
exports.verify = function (username, password) {
  const users = new Set(["Admin","Chris","Cameron","Joe","Olubi"]);
  return (users.has(username) && password === 'admin');
};
