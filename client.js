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

  // Handle incoming data and log it for the player
  conn.on("data", (data) => {
    console.log("Server says:", data);
  });

  // Event listener for when connection is established
  conn.on("connect", () => {
    console.log("Successfully connected to the game server!");
  });

  return conn;
};

// Export the connect function
module.exports = connect;
