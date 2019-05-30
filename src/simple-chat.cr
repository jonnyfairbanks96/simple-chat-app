require "json"
require "kemal"

MESSAGES = [] of String
SOCKETS = [] of HTTP::WebSocket

get "/" do
  render "public/index.ecr"
end

get "/messages" do |env|
  env.response.content_type = "application/json"
  {messages: MESSAGES}.to_json
end

ws "/chat" do |socket|
  # Add the client to SOCKETS list
  SOCKETS.push socket

  # Broadcast each message to all clients
  socket.on_message do |message|
    MESSAGES.push message
    SOCKETS.each do |socket|
      socket.send message
    end
  end

  # Remove clients from the list when it’s closed
  socket.on_close do
    SOCKETS.delete socket
  end
end

Kemal.run
