let connection; // Store the server connection

// Set up input handling for the client
const setupInput = (conn) => {
  connection = conn; // Save the connection
  const stdin = process.stdin; // Access standard input
  stdin.setRawMode(true); // Enable raw mode (no line buffering)
  stdin.setEncoding('utf8'); // Set encoding to UTF-8
  stdin.on('data', handleUserInput); // Listen for key presses
  stdin.resume(); // Start accepting input
  return stdin;
};

// Handle key presses from the user
const handleUserInput = (key) => {
  // Map keys to movement commands
  const commands = {
    w: 'Move: up',
    a: 'Move: left',
    s: 'Move: down',
    d: 'Move: right',
  };

  // If the key matches a command, send it to the server
  if (commands[key]) {
    console.log(`Sending command to server: ${commands[key]}`); // Debug log
    connection.write(commands[key]); // Send the command
  }

  // If the user presses Ctrl+C, exit the game
  if (key === '\u0003') {
    console.log('Exiting game...');
    process.exit(); // Quit the process
  }
};

module.exports = { setupInput }; // Export the setup function
