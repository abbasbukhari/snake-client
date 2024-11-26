const net = require("net"); // Import the 'net' module to create and manage network connections
const { IP, PORT } = require("./constants"); // Import the server's IP and port from constants.js

// Function to establish a connection to the server
const connect = () => {
  const conn = net.createConnection({ host: IP, port: PORT }); // Connect to the server using IP and port

  // Event: When the connection to the server is established
  conn.on("connect", () => {
    console.log("Successfully connected to the game server!"); // Confirm connection
    conn.write("Name: ABB"); // Send a predefined player name to the server
  });

  // Event: When data is received from the server
  conn.on("data", (data) => {
    console.log("Server says:", data); // Log the message from the server
  });

  conn.setEncoding("utf8"); // Set the encoding to UTF-8 for text data

  return conn; // Return the connection object to be used by other modules
};

module.exports = { connect }; // Export the connect function for use in play.js
