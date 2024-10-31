// client.js
const net = require("net");

// establishes a connection with the game server
const connect = function () {
  const conn = net.createConnection({
    host: "localhost", // IP address
    port: 50541,       // PORT number
  });

  // interpret incoming data as text
  conn.setEncoding("utf8");

  // Event handler for when the connection is established
  conn.on("connect", () => {
    console.log("Successfully connected to the game server!");
    
    // Send the name message to the server
    conn.write("Name: ABB"); // 'ABB' are the chosen initials
  });

  // Handle incoming data from the server
  conn.on("data", (data) => {
    console.log("Server says:", data);
  });

  return conn;
};

module.exports = connect;
