


// SOCKET CODE

// Create WebSocket
const socket = new WebSocket('ws://localhost:8001');
// When connected
socket.onopen = function () {
  socket.send('Hello');
};
// When error recieved
socket.onerror = function (error) {
  console.error('WebSocket Error ' + error);
};
// When message recieved
socket.onmessage = function (e) {
  console.log('Recieved '+e.data);
};



// PAGE CODE

// On button press
function sendField() {
  var message = document.getElementById("sendmessage").value;
  socket.send(message);
}
