require "db"
require "pg"
require "kemal"

MESSAGES = [] of String
SOCKETS = [] of HTTP::WebSocket

def get_messages
  DB.open "postgres://jfairb1996:#{ENV["DB_PASS"]}@localhost/simple_chat" do |db|
    return db.query "select messages from chat order by id" do |rs|
  end
end

get "/" do
  render "public/index.ecr"
end

get "/messages" do |env|
  env.response.content_type = "application/json"
  {messages: get_messages}.to_json
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

    DB.open "postgres://jfairb1996:#{ENV["DB_PASS"]}@localhost/simple_chat" do |db|
      db.exec "insert into chat(messages) values ($1)", message
    end
  end

  # Remove clients from the list when it’s closed
  socket.on_close do
    SOCKETS.delete socket
  end
end

Kemal.run
