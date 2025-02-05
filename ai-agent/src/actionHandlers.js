// src/actionHandlers.js
const initializeAgentKit = require('./agentKitInstance');

// Cache the AgentKit instance.
let agentKitInstance = null;

async function getAgentKit() {
  if (!agentKitInstance) {
    agentKitInstance = await initializeAgentKit();
  }
  return agentKitInstance;
}

async function handleCreateItem(params) {
  try {
    const agentKit = await getAgentKit();
    // Example: Invoke the "deploy_nft" action.
    const nftResult = await agentKit.invoke("deploy_nft", {
      description: params.description,
      // Add additional parameters as needed.
    });
    return {
      status: 'success',
      action: 'create_item',
      details: `Created NFT: ${JSON.stringify(nftResult)}`,
    };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

async function handleDeployToken(params) {
  try {
    const agentKit = await getAgentKit();
    const tokenResult = await agentKit.invoke("deploy_token", {
      symbol: params.symbol,
      decimals: params.decimals,
      maxSupply: params.maxSupply,
    });
    return {
      status: 'success',
      action: 'deploy_token',
      details: `Deployed token: ${JSON.stringify(tokenResult)}`,
    };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

async function handleSpawnBabyAI(params) {
  try {
    const agentKit = await getAgentKit();
    // Example: Use "get_wallet_details" to simulate wallet provisioning.
    const walletResult = await agentKit.invoke("get_wallet_details", {});
    return {
      status: 'success',
      action: 'spawn_baby_ai',
      details: `Spawned Baby AI wallet: ${JSON.stringify(walletResult)}`,
    };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

module.exports = { handleCreateItem, handleDeployToken, handleSpawnBabyAI };
