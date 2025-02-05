// test-decision.js
const { routeIntent } = require('./src/decisionEngine');

(async () => {
  // Simulate a sample intent to create an NFT character.
  const sampleIntent = {
    intent: "create_item",
    itemType: "NFT_Character",
    parameters: { description: "friend" }
  };

  const result = await routeIntent(sampleIntent);
  console.log("Decision Engine Result:", result);
})();
