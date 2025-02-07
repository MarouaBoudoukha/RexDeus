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

    // Build an options object that includes both variants.
    const nftOptions = {
      // These keys are used by the SDK (DeployNftSchema)
      name: params.name || "Friendly NPC",
      symbol: params.symbol || "NPC",
      baseURI: params.baseURI || params.description || "https://game.example.com/npc/",
      // This key is what the API ultimately validates
      base_uri: params.baseURI || params.description || "https://game.example.com/npc/"
    };

    console.log("Deploying NFT with options:", nftOptions);

    // Directly call deployNFT on the wallet provider (bypassing the action provider wrapper)
    const nftContract = await agentKit.walletProvider.deployNFT(nftOptions);
    const result = await nftContract.wait();

    return {
      status: 'success',
      action: 'create_item',
      details: `Created NFT: ${JSON.stringify({
        contractAddress: result.getContractAddress(),
        transactionHash: result.getTransaction() && result.getTransaction().getTransactionHash()
      })}`,
    };
  } catch (error) {
    console.error("Error in handleCreateItem:", error);
    return { status: 'error', message: error.message || error.toString() };
  }
}

async function handleDeployToken(params) {
  try {
    const agentKit = await getAgentKit();
    const actions = agentKit.getActions();
    const deployTokenAction = actions.find(
      a => a.name === 'WalletActionProvider_deploy_token' || a.name === 'Erc721ActionProvider_deploy_token'
    );s
    if (!deployTokenAction) {
      throw new Error("Deploy token action not found");
    }
    const tokenResult = await deployTokenAction.invoke(agentKit.walletProvider, {
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
    const actions = agentKit.getActions();
    // Find the get wallet details action (using WalletActionProvider_get_wallet_details).
    const walletDetailsAction = actions.find(a => a.name === 'WalletActionProvider_get_wallet_details');
    if (!walletDetailsAction) {
      throw new Error("Wallet details action not found");
    }
    const walletResult = await walletDetailsAction.invoke(agentKit.walletProvider, {});
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