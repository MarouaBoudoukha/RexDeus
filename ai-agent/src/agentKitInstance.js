const { AgentKit, CdpWalletProvider, walletActionProvider, cdpWalletActionProvider } = require('@coinbase/agentkit');
const { Coinbase, Wallet } = require('@coinbase/coinbase-sdk');
const fs = require('fs');
const path = require('path');

async function initializeAgentKit() {
  // Load required API key information from the environment variables.
  const apiKeyName = process.env.CDP_API_KEY_NAME;

  const apiKeyPrivateKey = process.env.CDP_API_KEY_PRIVATE_KEY.replace(/\\n/g, "\n");
  const networkId = process.env.NETWORK_ID;

  if (!apiKeyName || !apiKeyPrivateKey || !networkId) {
    console.error("Missing required environment variables. Check CDP_API_KEY_NAME, CDP_API_KEY_PRIVATE_KEY, and NETWORK_ID.");
    process.exit(1);
  }

  // Configure the Coinbase SDK using the API key information from the environment.
  const coinbase = new Coinbase(apiKeyName, apiKeyPrivateKey);
  console.log("Coinbase SDK configured from environment variables.");

  // Create a new wallet directly (this will create a Coinbase-Managed wallet).
  console.log("Creating wallet...");
  // pass a networkId when creating a wallet.
  const walletInstance = await Wallet.create({ networkId });
  console.log("Wallet created.");

  // Fund your wallet using the faucet.
  console.log("Funding wallet using faucet...");
  await walletInstance.faucet();
  console.log("Wallet funded.");

  // Configure the wallet provider with the funded wallet.
  const walletProvider = await CdpWalletProvider.configureWithWallet({
    apiKeyName,
    apiKeyPrivateKey,
    networkId,
    wallet: walletInstance,
  });

  // Instantiate the action providers.
  const walletProviderActions = walletActionProvider();
  const cdpWalletActions = cdpWalletActionProvider();

  // Create the AgentKit instance.
  const agentKit = await AgentKit.from({
    walletProvider,
    actionProviders: [walletProviderActions, cdpWalletActions],
  });

  // Log the available actions for verification.
  const actions = agentKit.getActions();
  console.log("Available actions:", actions.map(a => a.name));

  return agentKit;
}

module.exports = initializeAgentKit;
