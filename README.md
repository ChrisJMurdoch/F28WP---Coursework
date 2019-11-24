# F28WP---Coursework

Type of Game:
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

Manage code changes/versions (different file types/bugs/tasks) –

Open source practices (real-world) –

Plans/Objectives –
Week 1 – All members present at meeting at James Watt. Meeting used to brainstorm ideas about what our game should be. Ideas discussed Snake Multiplayer and Tron Multiplayer
Week 2 – All members present at meeting at James Watt. Finalized that game idea going forward is Snake Multiplayer. Spoke about what roles each member will have in the creation of the game. Basically, who is handling what.
2 people operating on front end and 2 people on back end (Fluid with our roles):
-	Chris (Back End 	NodeJS)
-	Olubi (Front End HTML and CSS/ JavaScript)
-	Cameron (Back End SQL / Front End HTML and CSS)
-	Joe (Back End JavaScript and NodeJS/ Front End HTML and CSS)

Week 3 – All members present at meeting at GRID. Joe and Eniolubi made basic HTML, CSS and JavaScript for the client side of the game. They implemented a basic index page and linked it to a JS script. Index page includes user play button and login card. CSS page styles the index page. JS script sends users login information to the server and animates buttons Chris had made hardcoded server IP. Cameron has started the basic Database with queries.
Week 4 – All members present at meeting at GRID. Joe has made JS script that sends clients login details to the server. Cameron has written
Week 5 – All members present
Week 6 – All members present
Week 7 – All members present
Week 8 – All members present
Week 9 – All members present
Week 10 – All members present

Mechanics for the Game:
Gameplay details –

Scoring/point system –
As each player is moving along the canvas their points are going up by 1 with the time, i.e. 1-point equals 1 second.
For players to get more points they must get other players to collide with their trail. If another player collides with your trail, you get 20 points.
If you are the winner (the last player left) you get an additional 50 points to your score.

Animation/required graphics/code –

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

Working client implementation (standalone) (offline sandpit version?) –
If you want to run a standalone version (offline version) of the game, connect the client to the local host:80 and run the offline server.

Could the game run standalone with no other players? (e.g., early testing) –
Yes, the game can run standalone.

JavaScript/DOM/CSS/html (validation/sanity checks) –

Data Management:
Separating data (temporary data, data for client and server/structured/managed) e.g., which information needs to be sent/received from the server, which is created/managed locally –
The information that is sent to/from the server is the users login request, successful login, the clients coordinates and the server’s coordinates. And it keeps looping.
If the login request to the server fails, a fail message is sent to client
Data that is local to the client is just the player data it receives.

Flow Control:
Login/temp visitor –
There is a login and a register feature where if the user is new, they must create an account before they can access the game. If the user is existing, they must login to access the game. This does not allow for temp visitor accounts as could complicate the database for users and their login credentials.

Restarting/joining existing game –

Managing resources/partitioning (groups/levels/regions) –

Server-client management:
Passing data to-from the server in real time –
Data can be passed to-from the server in real time

Suitable language/data transmission format e.g., time information, other user status information –

Server data storage (sql/mysql/litesql/..) –
The server data storage we are using to hold game related data is SQL and the DBMS is MySQL. The portal used to create queries for the database was done in PHPmyAdmin.

Deployment plan:
How will it be deployment testing be done –

Is the GitHub project easy to deploy and test (outside user/community/guidance information/ rules/settings/robust)? –

Deployment criteria clear (libraries, server permissions, defined) –

Is there a list of active tests, success, Q&A for the deployment of the project? –

Security:
Validate data/user information –
JavaScript is used to validate the user’s login credentials. Validating if the user enters the wrong login credentials, no login credentials, no create account credentials or non-valid create account credentials.

Security/safety/backups –

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
