// test-spawn.js
require('dotenv').config();
const { handleSpawnBabyAI } = require('./src/actionHandlers');

(async () => {
  const result = await handleSpawnBabyAI({});
  console.log("Spawn Baby AI Result:", result);
})();
