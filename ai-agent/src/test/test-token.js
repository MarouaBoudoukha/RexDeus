// test-token.js
require('dotenv').config();
const { handleDeployToken } = require('./src/actionHandlers');

(async () => {
  const params = {
    name: "TestToken",         // The token name.
    symbol: "TTK",             // The token symbol.
    decimals: 18,            // Token decimals.
    totalSupply: "10000",      // Total supply as a string (will be converted to BigInt).
  };
  const result = await handleDeployToken(params);
  console.log("Deploy Token Result:", result);
})();