window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');

  var clusterize = new Clusterize({
    scrollId: 'scrollArea',
    contentId: 'contentArea'
  });

  // Create WebSocket connection.
  var socket = new WebSocket('ws://jfairb1996dev.hopto.org:3000/chat');

  // Connection opened
  socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
  });

  // Listen for messages
  socket.addEventListener('message', function (event) {
    console.log('Message from server:', event.data);
    clusterize.append([`<div>${event.data}</div>`]);
    clusterize.scroll_elem.scrollTop = clusterize.scroll_elem.scrollHeight
  });

  var chatEnter = document.querySelector("#chatEnter");
  var chatMessage = document.querySelector("#chatMessage");
  chatMessage.addEventListener("keypress", (event) => {
    if (event.keyCode == 13) {
      var messageValue = chatMessage.value;
      if (messageValue != "") {
        socket.send(messageValue);
      }

      chatMessage.value = "";
      chatEnter.click();
    }
  });

  chatEnter.addEventListener("click", (event) => {
    var messageValue = chatMessage.value;
    if (messageValue != "") {
      socket.send(messageValue);
    }

    chatMessage.value = "";
    chatEnter.click();
  });
});
