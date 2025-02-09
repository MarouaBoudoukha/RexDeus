// src/agentKitInstance.js
const { AgentKit, CdpWalletProvider, walletActionProvider, erc721ActionProvider, pythActionProvider, cdpWalletActionProvider } = require('@coinbase/agentkit');
const { handleRegisterOperator } = require('./eigenLayerHandlers');

async function initializeAgentKit() {
  // Configure the wallet provider using environment variables.
  const walletProvider = await CdpWalletProvider.configureWithWallet({
    apiKeyName: process.env.CDP_API_KEY_NAME,
    apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY.replace(/\\n/g, "\n"),
    networkId: process.env.NETWORK_ID,
  });
  //console.log("CDP_API_KEY_NAME:", process.env.CDP_API_KEY_NAME);
  //console.log("CDP_API_KEY_PRIVATE_KEY:", process.env.CDP_API_KEY_PRIVATE_KEY);
  // Instantiate action providers.
  const walletProviderActions = walletActionProvider();
  const erc721 = erc721ActionProvider();
  const pyth = pythActionProvider();
  const cdpWalletActions = cdpWalletActionProvider();
  // Create the AgentKit instance.
  const agentKit = await AgentKit.from({
    walletProvider,
    actionProviders: [erc721, pyth, walletProviderActions, cdpWalletActions],
  });

  return agentKit;
}

module.exports = initializeAgentKit;