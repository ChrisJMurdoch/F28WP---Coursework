
CREATE TABLE Users {
  userName VARCHAR (255) PRIMARY KEY,
  password VARCHAR (255),
  highscore INT (11),
} ENGINE=INNODB;


/*
  QUERIES

  SIGN-UP Queries :

  INSERT INTO Users VALUES ("USERNAME","PASSWORD");
  INSERT INTO HighScore ("USERNAME", HIGHSCORE);

  ERROR HANDLING:

  BEGIN TRY
    INSERT INTO Users VALUES ("USERNAME","PASSWORD");
  END TRY
  BEGIN CATCH
    THROW 50001, This username already exists, 1
    PRINT ('this username already exists');
    THROW;
  END CATCH


  LOG-IN Queries:

  SELECT userName, password FROM Users WHERE "USERNAME" = Users.userName

  if password == "PASSWORD" -> allow login
  else -> password is incorrect please try again



  CONNECT NODE.JS SERVER TO MYSQL DATABASE

  CREATE CONNECTION :

  var mysql = require('mysql');

  var con = mysql.createConnection({
    host: "localhost",
    user: "yourusername",
    password: "yourpassword"
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

  TO IMBED QUERIES:

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO Users (userName, password) VALUES ?";
    var values = [
    ['Cameron Douglas', '12345']
    ...
    ]
    con.query(sql, [values], function(err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
  });

  CHECK BEFORE ALLOWING A userName

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "IF NOT EXISTS(SELECT userName, password FROM Users WHERE "USERNAME" = Users.userName)";
    con.query(sql, [values], function(err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
  });

  CHECK IF HighScore
  javascript:
  if currentScore > "SELECT highSocre FROM Users WHERE userName = usrName"{
    INSERT INTO Users (highScore) VALUES (score) WHERE userName = usrName
  }

  GET ALL SCORES AND USER:
  SELECT User, highScore FROM Users


  GET TOP 5 SCORES IN ORDER:
  SELECT userName, highscore FROM Users ORDER BY highscore DESC LIMIT 5
*/
