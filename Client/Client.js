// SOCKET INTERFACE

// Action codes // Keep synced with server codes
const PLAINTEXT = '0';
const REGISTER = '1';
const LOGIN = '2';
const CLIENT_TO_SERVER_COORDS = '3';
const SERVER_TO_CLIENT_COORDS = '4';

// Create WebSocket
const socket = new WebSocket('ws://137.195.110.187:8001'); // --MSI Heriot-Watt
//const socket = new WebSocket('ws://192.168.0.11:8001'); // --MSI Home

// PRIVATE EVENTS
// Connection event
socket.onopen = function () {
    console.log('Server connection established.');
};
// Error event
socket.onerror = function (error) {
    console.log('Error: ', error);
};
// Message event
socket.onmessage = function (e) {
    var splitmessage = e.data.split(';');
    var actioncode = splitmessage[0];
    var primarydata = splitmessage[1];
    var secondarydata = splitmessage[2];
    var tertiarydata = splitmessage[3];
    switch (actioncode) {
        case PLAINTEXT:
            console.log('Server: ', primarydata);
            break;
        case SERVER_TO_CLIENT_COORDS:
            splitmessage.shift();
            oncoords(splitmessage);
            break;
    }
};

// PRIVATE METHODS
// Send to server // Only for interface use
function internalsend(message) {
    console.log('Sending: ', message);
    socket.send(message);
};

// PUBLIC METHODS
// Send message to all
function sendmessage(message) {
    internalsend(PLAINTEXT + ';' + message);
};

// Send register request
function register(username, password) {
    internalsend(REGISTER + ';' + username + ';' + password);
};

// Send login request
function login(username, password) {
    internalsend(LOGIN + ';' + username + ';' + password);
};

// Send co-ordinates
function sendcoords(x, y) {
    internalsend(CLIENT_TO_SERVER_COORDS + ';' + x + ';' + y);
};

// PUBLIC EVENTS
// Receive Co-ordinates
function oncoords(data) {
    for (var i in data) {
      console.log(data[i].split('@'));
    }
    // ADD EVENT HERE
};



// PAGE CODE

// Set the enter key to activate send button
var input = document.getElementById("sendmessage");
input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        document.getElementById("sendbutton").click();
        input.value = '';
    }
});

// Only for debugging. Do not use internalsend
function sendField() {
    var message = document.getElementById("sendmessage").value;
    internalsend(message);
}

function submitBtnPress() {

    var usrName = document.getElementById("UsernameInput").value;
    var usrPsswd = document.getElementById("UsernamePassword").value;

    if (usrName != "" && usrPsswd != "") {
        login(usrName, usrPsswd);

        var r = document.getElementById("UserLogin").style;
        r.opacity = 1;

        (function fade() {
            (r.opacity -= .1) < 0 ? r.display = "none" : setTimeout(fade, 40)
        })();

    } else{
        alert("You must enter username and password");
    }
}

function btnPress() {
    var s = document.getElementById("PlayMenu").style;
    var r = document.getElementById("UserLogin").style.visibility = "visible";

    s.opacity = 1;
    (function fade() {
        (s.opacity -= .1) < 0 ? s.display = "none" : setTimeout(fade, 40)
    })();
}

function registerBtnPress() {
    
    var s = document.getElementById("UserLogin").style.visibility = "hidden";
    var r = document.getElementById("RegisterUser").style.visibility = "visible";

  }

function loginBtnPress() {
    
    var s = document.getElementById("RegisterUser").style = "hidden";
    var r = document.getElementById("UserLogin").style.visibility = "visible";
    
  }

function fade(element) {
    (element.opacity += .1) < 0 ? element.display = "none" : setTimeout(fade, 70)
        };