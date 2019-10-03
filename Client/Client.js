// SOCKET INTERFACE

// Create WebSocket
const socket = new WebSocket('ws://137.195.219.115:8001'); // --MSI Heriot-Watt
//const socket = new WebSocket('ws://192.168.0.38:8001'); // --MSI Home

// EVENTS
// Connection event
socket.onopen = function () {
    console.log('Server connection established.');
};
// Error event
socket.onerror = function (error) {
    console.log('Error: ', error);
};
// Ping event
socket.onping = function (error) {
    console.log('Error: ', error);
};
// Message event
socket.onmessage = function (e) {
    console.log('Received: ', e.data);
};

// METHODS
function sendmessage(message) {
    console.log('Sending: ', message);
    socket.send(message);
}

// PAGE CODE

// Set the enter key to activate send button
var input = document.getElementById("sendmessage");
input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        document.getElementById("sendButton").click();
        input.value = '';
    }
});

// On button press
function sendField() {
    var message = document.getElementById("sendmessage").value;
    sendmessage(message);
}

function test() {
    document.getElementById("PlayMenu").style.visibility = 'hidden';

    var element = document.getElementById("score");
    element.innerHTML = "Score: ";



    var para = document.createElement("p");
    var node = document.createTextNode("Score: ");
    para.appendChild(node);
    var element = document.getElementById("score");
    element.appendChild(para);
}

function btnPress() {
    var s = document.getElementById("PlayMenu").style;
    var r = document.getElementById("UserLogin").style.visibility = "visible";

    s.opacity = 1;
    (function fade() {
        (s.opacity -= .1) < 0 ? s.display = "none" : setTimeout(fade, 40)
    })();
}

function submitBtnPress(){

    var r = document.getElementById("UserLogin").style

    r.opacity = 1;
    changeBg("grey");

    (function fade() {
        (r.opacity -= .1) < 0 ? r.display = "none" : setTimeout(fade, 40)
    })();

    var table = "<table><tr><th>Username</th><th>Score</th></tr></table>";

    var element = document.getElementById("Leaderboard").innerHTML = table;
    var message = document.getElementById("UsernameInput").value;
    var message = document.getElementById("UsernamePassport").value;
    var message = document.getElementById("UsernameNationality").value;
    sendmessage(message);
}

function changeBg(color){
    document.body.style.background = color;
}
