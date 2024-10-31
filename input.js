// input.js

// Function to handle specific keypress actions
const handleUserInput = function (key) {
    if (key === '\u0003') { // '\u0003' is the "Ctrl + C" key command
      console.log("Exiting game...");
      process.exit();
    }
  };
  
  // Function to set up stdin for handling keyboard input
  const setupInput = function () {
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");
    stdin.resume();
  
    // Event listener for stdin data (keyboard input)
    stdin.on("data", handleUserInput);
  
    return stdin;
  };
  
  module.exports = { setupInput };
  