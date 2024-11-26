const { connect } = require("./client"); // Import the connect function from client.js
const { setupInput } = require("./input"); // Import the setupInput function from input.js

console.log("Connecting ..."); // Notify the user that the client is connecting to the server
const connection = connect(); // Establish a connection to the server
setupInput(connection); // Set up input handling for the client
