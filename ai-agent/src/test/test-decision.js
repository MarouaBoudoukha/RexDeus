// test-decision.js
require('dotenv').config();
const { routeIntent } = require('./src/decisionEngine');


(async () => {
  // Sample intent for creating an NFT (Smart AI NPC)
  const sampleIntent = {
    intent: "create_item",
    itemType: "NFT_Character",
    parameters: {
      description: "This is a smart NPC for Unreal Engine",
      name: "Friendly NPC",        // Character name
      symbol: "NPC",               // Token symbol
      baseURI: "https://game.example.com/npc/"  // Base URI for metadata
    }
  };

  const result = await routeIntent(sampleIntent);
  console.log("Decision Engine Result:", result);
})();
