// test-agentkit.js
require('dotenv').config(); // Load environment variables from .env

const initializeAgentKit = require('./src/agentKitInstance');

(async () => {
    try {
      const agentKit = await initializeAgentKit();
      console.log("AgentKit initialized successfully!");

      // Retrieve all available actions from the AgentKit instance.
      const actions = agentKit.getActions();
      console.log("Available actions:", actions.map(action => action.name));

      // Find the 'get_wallet_details' action.
      const getWalletDetailsAction = actions.find(action => action.name === 'WalletActionProvider_get_wallet_details');

      if (getWalletDetailsAction) {
        // Invoke the action. Note: The first parameter is the walletProvider.
        const details = await getWalletDetailsAction.invoke(agentKit.walletProvider, {});
        console.log("Wallet Details:", details);
      } else {
        console.error("get_wallet_details action not found");
      }
    } catch (error) {
      console.error("AgentKit initialization error:", error);
    }
  })();