const net = require("net");

// establishes a connection with the game server
const connect = function () {
  const conn = net.createConnection({
    host: "localhost", // IP Address
    port: 50541, // Port Number
  });

  // interpret incoming data as text
  conn.setEncoding("utf8");

  // Handle incoming data and log it
  conn.on("data", (data) => {
    console.log("Server says:", data);
  });

  // Event listener for when connection is established
  conn.on("connect", () => {
    console.log("Successfully connected to the game server!");
  });

  return conn;
};

console.log("Connecting ...");
connect();
