
// test-agent.js
require('dotenv').config();

const { motherAI, spawnBabyAI } = require('./src/agent');

(async () => {
  console.log("Mother AI Initial Settings:", motherAI.globalSettings);
  motherAI.updateGlobalSetting("weather", "rainy");

  const baby = await spawnBabyAI("baby_1");
  if (baby) {
    baby.receiveTask("Test Task: Patrol the area");
    console.log("Baby AI Memory:", baby.memory);
    console.log("Baby AI Stats:", baby.stats); // Verify that attributes (STR, WIS, DEX, INT, CON, CHA) are set.
  }
})();
