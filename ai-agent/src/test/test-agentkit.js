// test-agentkit.js
require('dotenv').config(); // Load environment variables

const initializeAgentKit = require('../agentKitInstance');

(async () => {
  try {
    const agentKit = await initializeAgentKit();
    console.log("AgentKit initialized successfully!");

    // Retrieve available actions for debugging.
    const actions = agentKit.getActions();
    console.log("Available actions:", actions.map(action => action.name));

    // Find and invoke the wallet details action.
    const getWalletDetailsAction = actions.find(
      action => action.name === 'WalletActionProvider_get_wallet_details'
    );

    if (getWalletDetailsAction) {
      const details = await getWalletDetailsAction.invoke(agentKit.walletProvider, {});
      console.log("Wallet Details:", details);
    } else {
      console.error("get_wallet_details action not found");
    }
  } catch (error) {
    console.error("AgentKit initialization error:", error);
  }
})();
