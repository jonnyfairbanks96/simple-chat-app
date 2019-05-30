window.addEventListener('DOMContentLoaded', (event) => {
  if (document.cookie == "") {
    document.cookie = prompt("What is your name?");
  }

  var clusterize = new Clusterize({
    scrollId: 'scrollArea',
    contentId: 'contentArea'
  });

  fetch('messages').then((response) => {
    return response.json();
  }).then((data) => {
    var contentToAdd = data.messages.map((message) => `<div>${message}</div>`);
    clusterize.update(contentToAdd);
    clusterize.scroll_elem.scrollTop = clusterize.scroll_elem.scrollHeight
  });

  // Create WebSocket connection.
  var socket = new WebSocket('ws:/' + window.location.host + '/chat');

  // Connection opened
  socket.addEventListener('open', function (event) {
  });

  // Listen for messages
  socket.addEventListener('message', function (event) {
    clusterize.append([`<div>${event.data}</div>`]);
    clusterize.scroll_elem.scrollTop = clusterize.scroll_elem.scrollHeight
  });

  var chatEnter = document.querySelector("#chatEnter");
  var chatMessage = document.querySelector("#chatMessage");
  chatMessage.addEventListener("keypress", (event) => {
    if (event.keyCode == 13) {
      var messageValue = chatMessage.value;
      if (messageValue != "") {
        socket.send(`${document.cookie}: ${messageValue}`);
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
