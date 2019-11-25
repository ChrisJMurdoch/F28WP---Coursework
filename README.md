# F28WP---Coursework

Type of Game:
2D MMO game

Team members –
-	Eniolubi Faleye             git username (eniolubifaleye) & (ef27)
-	Chris Murdoch               git username (ChrisJMurdoch)
-	Cameron Douglas             git username (cd94)
-	Joseph Wiggin               git username (JW148)

Meeting dates –
We plan to meet every Tuesday afternoon at 1pm. Location either at James Watt Lounge Area or at GRID.

Organized on GitHub –
Yes, it has been organized on GitHub

Coding Styles –
Coding styles are consistent and accurate. Consistent use of correct indentation and consistent use of white space to aid readability in JavaScript, CSS and HTML.
Most of the variables and functions have meaningful names which aid the understanding of their functionality. Most of the variables are local instead of global. Variables are only global when they need to be.

Code validation/testing plan (automated vs user) –
No Unit testing code plan available but bugs and features were agile tested along the development of the game

Manage code changes/versions (different file types/bugs/tasks) –
different versions of the game are accessible from the GIT repository. Older verions of the game can be pulled.
Code changes are also managed through the GIT repository

Open source practices (real-world) –
Since it is on a public GIT repository the game code is open source which allows anyone to view and study the code

Plans/Objectives –
Week 1 – All members present at meeting at James Watt. Meeting used to brainstorm ideas about what our game should be. Ideas discussed Snake Multiplayer and Tron Multiplayer
Week 2 – All members present at meeting at James Watt. Finalized that game idea going forward is Snake Multiplayer. Spoke about what roles each member will have in the creation of the game. Basically, who is handling what.
2 people operating on front end and 2 people on back end (Fluid with our roles):
-	Chris (Back End 	NodeJS)
-	Olubi (Front End HTML and CSS/ JavaScript)
-	Cameron (Back End SQL / Front End HTML and CSS)
-	Joe (Back End JavaScript and NodeJS/ Front End HTML and CSS)

Week 3 – All members present at meeting at GRID. Joe and Eniolubi made basic HTML, CSS and JavaScript for the client side of the game. They implemented a basic index page and linked it to a JS script. Index page includes user play button and login card. CSS page styles the index page. JS script sends users login information to the server and animates buttons Chris had made hardcoded server IP. Cameron has started the basic Database with queries.

Week 4 – All members present at meeting at GRID. Joe has made JS script that sends clients login details to the server. Eniolubi has written CSS, Javascript and HTML for a leaderboard and the script to let if fade in. Chris 
cleaned up syntax errors and connected the server to Camerons external database.

Week 5 – All members present at meeting at James Watt. Meeting to go over what we have done so far (like the implementation of the server (main goal)) and what we still have to do (features that need to be implemented like collision of characters etc.)

Week 6 – All members present at meeting at James Watt. Continuing to go over what needs to be done still for this game. Ideas brought up by Joseph was register div so users can create new accounts before they play the game.
Chris reminded members that mobile version of game has to be implemented (although futher down the line of progress) along with optimizing resizing of the game . Eniolubi suggested to Cameron that queries for the
leaderbaord have to be created.

Week 7 – All members present at meeting at GRID. Catch up of what each member has done so far. members noticed that no commitd have been pushed to the GIT repository in a while.

Week 8 – All members present
Week 9 – All members present
Week 10 – All members present

Mechanics for the Game:
Gameplay details –
Each user has a 2D line that represents thier sprite for thier player. The user is supposed to use their sprite to make other users collide with them
User used W-A-S-D keys to move thier sprite around the game canvas.

Scoring/point system –
As each player is moving along the canvas their points are going up by 1 with the time, i.e. 1-point equals 1 second.
The longer you last the more your total score will be.
Users scores get reset to zero if they collide with another user

Animation/required graphics/code –
Since the game is 2D, animation wise there isn't a great aspect of that. Buttons for the controls on the mobile version of the game are animated though.
Once pressed (active), they push in. Code for that is written in CSS

User input/Controls –
User must input their login credentials (username and password) before they start playing the game. If the user is new, they will create a new account by inputting their desired username and password.
To control their player, the user will use W-A-S-D keys. W to move up, A to move left, S to move down and D to move right.
Controls are sent as vector components and sent to the server to be processed, the vector is then normalised and processed using delta-time calculations.
This stops any form of manipulation attack.

Interaction involvements/collisions –
Collision is done serverside so as to avoid cheating.  Each time a player requests a new movement, the new body segment is checked against existing segments
using our optimized algorithm for line segment intersection and a  kill notification is sent to all players if there is a collision.

Testing:
Usability –
For mobile version, users will be given LEFT-RIGHT-UP-DOWN div created buttons which when pressed will be used to alter the direction of thier sprite in game. This aids usabilty as buttons are simplistic
in functionality and are positioned for easy use and understaning.
Gameplay even though straight forward enough contains a short sentence which explains how to play the game, further aiding usabilty.

Working client implementation (standalone) (offline sandpit version?) –
If you want to run a standalone version (offline version) of the game, connect the client to the local host:80 and run the offline server.

Could the game run standalone with no other players? (e.g., early testing) –
Yes, the game can run standalone.

JavaScript/DOM/CSS/html (validation/sanity checks) –
N/A

Data Management:
Separating data (temporary data, data for client and server/structured/managed) e.g., which information needs to be sent/received from the server, which is created/managed locally –
The information that is sent to/from the server is the users login request, successful login, the clients coordinates and the server’s coordinates. And it keeps looping.
If the login request to the server fails, a fail message is sent to client
Data that is local to the client is just the player data it receives.

Flow Control:
Login/temp visitor –
There is a login and a register feature where if the user is new, they must create an account before they can access the game. If the user is existing, they must login to access the game. This does not allow for temp visitor accounts as could complicate the database for users and their login credentials.

Restarting/joining existing game –
If a user restarts whilst in a current game, they are removed from the current game. If the user wants to join an existing game, they just have to log back in.

Managing resources/partitioning (groups/levels/regions) –
Code for the game is split into seperate functionality folders and functionality sheets. CSS, HTML and Javascript that is directly for client side is put in a client side folder.
Queries for the database are put in a database folder
Node.js and Javascript that is directly for the server side is put in a server side folder

Server-client management:
Passing data to-from the server in real time –
Data can be passed to-from the server in real time

Suitable language/data transmission format e.g., time information, other user status information –
Status information has been used in the console for debugging
time information has been used in the client side Javascript for game code 

Server data storage (sql/mysql/litesql/..) –
The server data storage we are using to hold game related data is SQL and the DBMS is MySQL. The portal used to create queries for the database was done in PHPmyAdmin.

Deployment plan:
How will it be deployment testing be done –
N/A

Is the GitHub project easy to deploy and test (outside user/community/guidance information/ rules/settings/robust)? –
N/A

Deployment criteria clear (libraries, server permissions, defined) –
N/A

Is there a list of active tests, success, Q&A for the deployment of the project? –
N/A

Security:
Validate data/user information –
JavaScript is used to validate the user’s login credentials. Validating if the user enters the wrong login credentials, no login credentials, no create account credentials or non-valid create account credentials.

Security/safety/backups –
N/A

Compression (file/data formats, jpg vs png vs bmp, zlib, ..) - 
Our game uses a .png file. it is used as our game's background which has lossless compression


Optimization:
Slow connections, crashes, different browsers –
The game is run mostly serverside and uses delta-time based movement so that clients move the same pixels/s, regardless of connection speed, there are also no
hard-timed events, the speed at which clients and server communicate is based on a feedback loop, but capped at the servers request queue process rate at 100Hz.
Game is optimized to be full screen for different browsers such as:
-	Google Chrome
-	Fire Fox
-	Internet Explorer etc.
Game is also optimized for different phone types such as:
-	Windows
-	Apple
-	Android etc.

Optimizing javascript code/graphics/design –
The server uses a quest queue to act as a buffer between client requests from socket interrupts and processes them at 100Hz on the main thread, this avoids
multithreading issues and ensures that the interrupt threads are kept short.
Since our game is 2D and involves 2D sprites for players to move, there isn’t a great graphical aspect.
Design wise for browsers, we went for minimalistic/simplistic retro style which fits in with our game idea

Library/log:
How many lines of code have been written by each team member? –
Lines of code written by each member (specifically is not known). Our version control in our GIT repository is not fully functioning as some commits haven’t been registered meaning that some lines of code haven’t been registered.
Also because of the limitations of GIT, members couldn’t work on the same game functionalities at the same time (merge errors). Because of this, occasionally there have been moments in which a member has completed and pushed a piece of code in which another member was working on. This leading to the later not being able to push lines of code.

How many external files/libraries have been used? (clearly explained) –
<link href="https://fonts.googleapis.com/css?family=Bungee&display=swap" rel="stylesheet">
CSS style sheet for our font; Bungee. This is an external style sheet that is used throughout the coursework. It is used as the font as its style fits our game aesthetic nicely.

How many external assets (images/sounds)? –
So far there is one external asset. It is a .png file that is used as our game’s backgrounds. Our coursework doesn’t contain any game sounds either.

What are the game limitations? –
Currently the game cannot be operated on mobile once it is in landscape. This is because the buttons don’t display


Ongoing Maintenance (week by week):

Each team member is contributing (commits, updates, testing) - 
Each team member is/has contributing/contributed to the game. All members have pushed and pulled commits from the GIT repository

Bugs, features, releases are reguarly updated - 
If a bug is found, members of the GIT repository are made aware of it quickly.
features in the gameplay are/have been pushed to the GIT repository
Game is updapted

Does the team work synergistically? - 
Team worked well together (synergistically). Work was shared and good communication between members aided the games development.
 
