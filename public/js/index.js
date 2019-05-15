window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  // Create WebSocket connection.
  var socket = new WebSocket('ws://jfairb1996dev.hopto.org:3000/chat');

  // Connection opened
  socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
  });

  var chatTable = document.querySelector(".chatTable");
  // Listen for messages
  socket.addEventListener('message', function (event) {
    console.log('Message from server:', event.data);
    var newRow = chatTable.insertRow(-1);
    newRow.textContent = event.data;
  });

  var chatEnter = document.querySelector("#chatEnter");
  var chatMessage = document.querySelector("#chatMessage");
  chatMessage.addEventListener("keypress", (event) => {
    if (event.keyCode == 13) {
      var messageValue = chatMessage.value;
      socket.send(messageValue);

      chatMessage.value = "";
      chatEnter.click();
    }
  });
});
