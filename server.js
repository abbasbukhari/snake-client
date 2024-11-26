const net = require("net"); // Import the 'net' module to create a server
const { PORT, IP } = require("./constants"); // Import IP and PORT from constants.js

const connections = []; // Store active client connections
const gridSize = 10; // Size of the game grid (10x10)
let gameState = initializeGameState(); // Initialize the game state
let food = generateFood(); // Place the first piece of food on the grid
let gameLoopInterval; // Store the game loop timer

// Create the server to handle client connections
const server = net.createServer((connection) => {
  console.log("New client connected!"); // Notify when a new client connects
  connections.push(connection); // Add the new connection to the list

  addPlayer(connection); // Add a new player to the game state

  // Send a welcome message and the initial game board to the client
  connection.write("Welcome to Snake! Use 'w', 'a', 's', 'd' to move.\n");
  connection.write(renderGameBoard());

  // Handle incoming data (key presses) from the client
  connection.on("data", (data) => handleUserInput(data, connection));

  // Handle client disconnection
  connection.on("end", () => handleDisconnect(connection));

  // Handle connection errors
  connection.on("error", (err) => console.error("Connection error:", err.message));

  // Start the game loop if it hasn't already been started
  if (!gameLoopInterval) {
    gameLoopInterval = setInterval(() => {
      updateGameState(); // Update the game state
      broadcast(renderGameBoard()); // Send the updated game board to all clients
    }, 200); // Run the game loop every 200 milliseconds
  }
});

// Handle user input (e.g., 'Move: up')
function handleUserInput(data, connection) {
  const input = data.toString().trim(); // Convert the incoming data to a string
  const playerIndex = connections.indexOf(connection); // Find which player sent the data
  const player = gameState.players[playerIndex]; // Get the player's state

  // Map movement commands to directions
  const directionMapping = {
    'Move: up': 'w',
    'Move: down': 's',
    'Move: left': 'a',
    'Move: right': 'd',
  };

  console.log(`Received command from client: ${input}`); // Debug log

  // If the input matches a valid movement command, update the player's direction
  if (directionMapping[input]) {
    console.log(`Player ${playerIndex} direction set to ${directionMapping[input]}`);
    player.direction = directionMapping[input];
  }
}

// Handle client disconnection
function handleDisconnect(connection) {
  console.log("Client disconnected."); // Notify when a client disconnects
  const index = connections.indexOf(connection); // Find the connection's index
  if (index !== -1) {
    connections.splice(index, 1); // Remove the connection from the list
    gameState.players.splice(index, 1); // Remove the player from the game state
  }
  // Stop the game loop if no players are left
  if (connections.length === 0 && gameLoopInterval) {
    clearInterval(gameLoopInterval); // Stop the game loop
    gameLoopInterval = null; // Reset the game loop timer
  }
}

// Initialize the game state (empty at the start)
function initializeGameState() {
  return { players: [] }; // Start with no players
}

// Add a new player to the game
function addPlayer(connection) {
  const playerId = connections.indexOf(connection); // Get the player's ID
  const startPositions = [{ x: 2, y: 2 }, { x: 7, y: 7 }]; // Starting positions for players
  gameState.players.push({
    snake: [startPositions[playerId] || { x: 0, y: 0 }], // Initialize the snake's position
    direction: "d", // Default direction: right
    alive: true, // Player starts alive
    grew: false, // Snake doesn't grow immediately
  });
}

// Update the game state for all players
function updateGameState() {
  gameState.players.forEach((player, index) => {
    if (player.alive) {
      moveSnake(player); // Move the snake
      if (checkCollision(player)) {
        console.log(`Player ${index} collided!`); // Notify of collision
        player.alive = false; // Mark the player as dead
        player.snake = []; // Clear the snake to prevent further rendering
      } else {
        checkFoodCollision(player); // Check if the snake eats the food
      }
    }
  });
}

// Move the snake based on its direction
function moveSnake(player) {
  const head = { ...player.snake[0] }; // Copy the current head position

  // Move the snake based on direction
  if (player.direction === "w") head.y -= 1; // Move up
  if (player.direction === "a") head.x -= 1; // Move left
  if (player.direction === "s") head.y += 1; // Move down
  if (player.direction === "d") head.x += 1; // Move right

  console.log(`New head position: (${head.x}, ${head.y})`); // Debug log

  player.snake.unshift(head); // Add the new head to the snake
  if (!player.grew) {
    player.snake.pop(); // Remove the tail if the snake didn't grow
  }
  player.grew = false; // Reset the growth flag
}

// Check if the snake eats the food
function checkFoodCollision(player) {
  const head = player.snake[0]; // Get the snake's head position
  if (head.x === food.x && head.y === food.y) {
    console.log("Food eaten!"); // Notify of food consumption
    player.grew = true; // Mark the snake to grow
    food = generateFood(); // Generate new food
  }
}

// Check if the snake collides with walls or itself
function checkCollision(player) {
  const head = player.snake[0]; // Get the snake's head position

  // Check if the snake hits the wall
  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
    return true;
  }

  // Check if the snake collides with itself
  for (let i = 1; i < player.snake.length; i++) {
    if (head.x === player.snake[i].x && head.y === player.snake[i].y) {
      return true;
    }
  }

  return false; // No collision
}

// Render the game board
function renderGameBoard() {
  let board = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(" ")); // Create an empty grid

  // Place snakes on the grid
  gameState.players.forEach((player) => {
    player.snake.forEach((segment) => {
      // Only place segments that are within grid bounds
      if (
        segment.x >= 0 &&
        segment.x < gridSize &&
        segment.y >= 0 &&
        segment.y < gridSize
      ) {
        board[segment.y][segment.x] = "S"; // Represent the snake with 'S'
      }
    });
  });

  // Place food on the grid
  if (
    food.x >= 0 &&
    food.x < gridSize &&
    food.y >= 0 &&
    food.y < gridSize
  ) {
    board[food.y][food.x] = "*"; // Represent food with '*'
  }

  // Convert the grid to a string for rendering
  return board.map((row) => row.join("")).join("\n");
}

// Generate a new piece of food
function generateFood() {
  let foodPosition;
  do {
    // Generate random food coordinates
    foodPosition = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
  } while (
    gameState.players.some((player) =>
      player.snake.some((segment) => segment.x === foodPosition.x && segment.y === foodPosition.y)
    )
  );
  return foodPosition; // Return the food's position
}

// Send data to all clients
function broadcast(data) {
  connections.forEach((conn) => conn.writable && conn.write(data)); // Write data to each connection
}

// Start the server
server.listen(PORT, IP, () => {
  console.log(`Server is running on ${IP}:${PORT}`); // Notify the server is running
});
