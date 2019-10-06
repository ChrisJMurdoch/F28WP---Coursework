CREATE TABLE HighScore {
  user VARCHAR (25) PRIMARY KEY,
  highScore INTEGER (10000),
}ENGINE=INNODB;

CREATE TABLE Users {
  userName VARCHAR (25) PRIMARY KEY,
  password VARCHAR (25),
  FOREIGN KEY (userName) REFERENCES HighScore(user),
} ENGINE=INNODB;



/* QUERIES

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

*/
