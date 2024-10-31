// input.js
let connection;

const setupInput = (conn) => {
  connection = conn;

  const stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.setEncoding("utf8");
  stdin.resume();
  stdin.on("data", handleUserInput);
  return stdin;
};

const handleUserInput = (key) => {
  if (key === '\u0003') {
    process.exit();
  }
  
  // Movement commands
  if (key === 'w') connection.write("Move: up");
  if (key === 'a') connection.write("Move: left");
  if (key === 's') connection.write("Move: down");
  if (key === 'd') connection.write("Move: right");

  // Canned messages
  if (key === '1') connection.write("Say: Let's go!");
  if (key === '2') connection.write("Say: Watch out!");
  if (key === '3') connection.write("Say: Ssssssss!");
  if (key === '4') connection.write("Say: Too close!");
};

// Export setupInput function
module.exports = { setupInput };
