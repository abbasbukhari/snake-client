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

// Handle incoming data from the server
  conn.on("data", (data) => {
        console.log("Server says:", data);
      });

  // Event handler for when the connection is established
  conn.on("connect", () => {
    console.log("Successfully connected to the game server!");
    conn.write("Name: ABB"); // 'ABB' are the chosen initials


    // // Send a single "Move: up" command
    // conn.write("Move: up");

    // // Send multiple successive "Move: up" commands with slight delay
    // setTimeout(() => conn.write("Move: up"), 0);
    // setTimeout(() => conn.write("Move: up"), 50);
    // setTimeout(() => conn.write("Move: up"), 100);

    // // Continuous movement using setInterval
    // const moveInterval = setInterval(() => {
    //   conn.write("Move: up");
    // }, 50);

    // // Stop the continuous movement after 500ms
    // setTimeout(() => clearInterval(moveInterval), 500);
  });


  return conn;
};

module.exports = { connect };
