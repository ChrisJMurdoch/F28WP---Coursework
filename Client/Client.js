


// SOCKET INTERFACE

// Create WebSocket
const socket = new WebSocket('ws://137.195.210.2:8001'); // --MSI Heriot-Watt
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
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    document.getElementById("sendbutton").click();
    input.value = '';
  }
});

// On button press
function sendField() {
  var message = document.getElementById("sendmessage").value;
  sendmessage(message);
}
