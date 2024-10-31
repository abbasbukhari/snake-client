// input.js

// Stores the active TCP connection object.
let connection;

// Function to handle specific keypress actions
const handleUserInput = function (key) {
  if (key === '\u0003') { // '\u0003' is the "Ctrl + C" key command
    console.log("Exiting game...");
    process.exit();
  }
  
  // Mapping WASD keys to movement commands
  if (key === 'w') {
    connection.write("Move: up");
  }
  if (key === 'a') {
    connection.write("Move: left");
  }
  if (key === 's') {
    connection.write("Move: down");
  }
  if (key === 'd') {
    connection.write("Move: right");
  }
};

// Function to set up stdin for handling keyboard input
const setupInput = (conn) => {
  connection = conn;
  const stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.setEncoding("utf8");
  stdin.resume();

  // Event listener for stdin data (keyboard input)
  stdin.on("data", handleUserInput);

  return stdin;
};

module.exports = { setupInput };
