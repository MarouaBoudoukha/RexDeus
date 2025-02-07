// src/agent.js
const initializeAgentKit = require('./agentKitInstance');

// Mother AI: The central controller of the game environment.
const motherAI = {
  wallet: '0xMotherAIWalletAddress', // This may later be dynamically provisioned.
  globalSettings: {
    calendar: new Date().toISOString(),
    weather: 'sunny',
    dayNightCycle: 'day',
    gameEconomy: {},
  },
  updateGlobalSetting(key, value) {
    this.globalSettings[key] = value;
    console.log(`Mother AI updated ${key} to ${value}`);
  },
  delegateTask(task, babyIDs = []) {
    console.log(`Mother AI delegating task "${task}" to Baby AIs: ${babyIDs.join(', ')}`);
    babyIDs.forEach(id => {
      if (babyAIAgents[id]) {
        babyAIAgents[id].receiveTask(task);
      }
    });
  }
};

const babyAIAgents = {};

// spawnBabyAI: Creates a new Baby AI (NPC) with default attributes.
async function spawnBabyAI(id, initialState = {}) {
  try {
    // Use the wallet provider to simulate provisioning for the Baby AI.
    // (Here we assume you use a get_wallet_details action; you could also create a dedicated wallet.)
    const agentKit = await initializeAgentKit();
    // Using the wallet provider’s built-in method (or an action) to get wallet details.
    // (In a real implementation, you might have a "create_wallet" action for Baby AIs.)
    const walletResult = await agentKit.walletProvider.getAddress();
    // Default attributes for the NPC (which your Unreal Engine plugin will later use)
    const defaultAttributes = {
      STR: 10,
      WIS: 10,
      DEX: 10,
      INT: 10,
      CON: 10,
      CHA: 10,
    };
    const babyAI = {
      id,
      wallet: walletResult, // The wallet address for this Baby AI.
      stats: {
        health: 100,
        energy: 100,
        mood: 'neutral',
        ...defaultAttributes,
        ...initialState.stats,
      },
      location: initialState.location || { x: 0, y: 0, z: 0 },
      memory: [],
      receiveTask(task) {
        console.log(`Baby AI ${this.id} received task: ${task}`);
        this.memory.push(`Task received: ${task} at ${new Date().toISOString()}`);
      },
      updateState(newState) {
        this.stats = { ...this.stats, ...newState.stats };
        if (newState.location) {
          this.location = newState.location;
        }
        console.log(`Baby AI ${this.id} state updated:`, this.stats, this.location);
      }
    };
    babyAIAgents[id] = babyAI;
    console.log(`Spawned Baby AI with ID: ${id}`);
    return babyAI;
  } catch (error) {
    console.error(`Error spawning Baby AI ${id}:`, error);
    return null;
  }
}

module.exports = { motherAI, babyAIAgents, spawnBabyAI };
