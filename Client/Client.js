


// SOCKET CODE

// Create WebSocket
const socket = new WebSocket('ws://137.195.210.2:8001'); // --MSI Heriot-Watt
//const socket = new WebSocket('ws://192.168.0.37:8001'); // --MSI Home

// When connected
socket.onopen = function () {
  console.log('Server connection established.');
};
// When error recieved
socket.onerror = function (error) {
  console.error('WebSocket error: ' + error);
};
// When message recieved
socket.onmessage = function (e) {
  console.log('Recieved message: ' + e.data);
};



// PAGE CODE

// On button press
function sendField() {
  var message = document.getElementById("sendmessage").value;
  console.log('Sending: ', message);
  socket.send(message);
}
