
// Modules
const mysql = require("mysql");

// Connection
var db_connection;

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
exports.verifyDummy = function (username, password) {
  const users = new Set(["Admin","Chris","Cameron","Joe","Olubi"]);
  return (users.has(username) && password === "admin");
};

// Database validation
exports.verify = function (username, password, callback) {
  var sql = 'SELECT * FROM `Users` WHERE `userName` = ?';
  db_connection.query(sql, username, function(error, results) {
    if (error) {
      callback(false);
      return;
    }
    if (results.length === 0) {
      callback(false);
      return;
    }
    callback(results[0].password === password);
  });
};

exports.add_users = function() {

  var cre = "CREATE TABLE Users ( userName varchar(255), password varchar(255) );"

  var ins = "INSERT INTO Users (userName, password) VALUES ?";
  var values = [
    ["Chris Murdoch", "cm"],
    ["Cameron Douglas", "cd"],
    ["Joe Wiggin", "jw"],
    ["Olubi Faleye", "ef"]
  ];

  db_connection.query(cre, function (error, results, fields) {
    if (error) throw error;
  });

  db_connection.query(ins, [values], function (error, results, fields) {
    if (error) throw error;
    console.log("Number of records inserted: " + results.affectedRows);
  });
};
