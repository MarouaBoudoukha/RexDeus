// test-operator.js
require('dotenv').config();
const { routeIntent } = require('./src/decisionEngine');

(async () => {
  // Sample intent to register as an operator.
  const sampleIntent = {
    intent: "register_operator",
    parameters: {
      // Optionally include additional parameters here.
    }
  };

  const result = await routeIntent(sampleIntent);
  console.log("Operator Registration Intent Result:", result);
})();
