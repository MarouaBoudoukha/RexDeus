// src/agentKitInstance.js
const { AgentKit, CdpWalletProvider, walletActionProvider, erc721ActionProvider, pythActionProvider } = require('@coinbase/agentkit');

async function initializeAgentKit() {
  // Configure the wallet provider with your CDP keys and network.
  const walletProvider = await CdpWalletProvider.configureWithWallet({
    apiKeyName: process.env.CDP_API_KEY_NAME,
    apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY.replace(/\\n/g, "\n"),
    networkId: process.env.NETWORK_ID,
  });

  // Instantiate action providers.
  const walletProviderActions = walletActionProvider();
  const erc721 = erc721ActionProvider();
  const pyth = pythActionProvider();

  // Create the AgentKit instance.
  const agentKit = await AgentKit.from({
    walletProvider,
    actionProviders: [erc721, pyth, walletProviderActions],
  });

  return agentKit;
}

module.exports = initializeAgentKit;