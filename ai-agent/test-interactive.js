// test-interactive.js
require('dotenv').config();
const readline = require('readline');
const { routeIntent } = require('./src/decisionEngine');

// Create an interactive CLI.
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Welcome to the Smart NPC AI Agent Demo!");
console.log("Type a command (e.g., 'Oh mighty goddess, create a brave warrior NPC with STR 15, WIS 12, DEX 14, INT 10, CON 13, CHA 8') and press Enter.");

rl.on('line', async (input) => {
  let intentObj;

  // For demonstration, if the input contains "create", we assume it's an NFT character creation command.
  if (input.toLowerCase().includes("create")) {
    intentObj = {
      intent: "create_item",
      itemType: "NFT_Character",
      parameters: {
        description: input,
        name: "Brave Warrior NPC",       // You can extract these from the input with more advanced parsing.
        symbol: "BWNPC",
        baseURI: "https://game.example.com/npc/"
      }
    };
  } else if (input.toLowerCase().includes("register")) {
    // If input contains "register", assume it triggers operator registration.
    intentObj = {
      intent: "register_operator",
      parameters: {}
    };
  } else {
    console.log("Command not recognized. Please try: 'create' or 'register'.");
    return;
  }

  console.log("Processing your command...");
  try {
    const result = await routeIntent(intentObj);
    console.log("Response:", result);
  } catch (error) {
    console.error("Error:", error.message);
  }
  console.log("\nType another command, or press Ctrl+C to exit.");
});
