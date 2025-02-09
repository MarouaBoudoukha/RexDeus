// src/eigenLayerIntegration.js
const { ethers } = require("ethers");

// --- CONFIGURATION ---
// Use your testnet DelegationManager address (from EigenLayer testnet-holesky)
const DELEGATION_MANAGER_ADDRESS = process.env.EIGENLAYER_CONTRACT_ADDRESS;

// Minimal ABI for operator registration.
const DELEGATION_MANAGER_ABI = [
  "function registerAsOperator((address,address,uint256) config, string extraData) public returns (bool)"
];

// Create an ethers provider using your RPC URL.
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Create a signer using your private key.
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

/**
 * Registers the service (or an NPC’s wallet) as an operator on EigenLayer.
 * This function demonstrates operator registration (or delegation) and returns the transaction hash.
 *
 * @returns {Promise<string>} - The transaction hash if registration is successful.
 */
async function registerOperatorForService() {
  try {
    // Create a contract instance for the DelegationManager.
    const delegationManager = new ethers.Contract(
        DELEGATION_MANAGER_ADDRESS,
        DELEGATION_MANAGER_ABI,
        signer
      );

      // Prepare the operator configuration as an array (tuple):
      // [__deprecated_earningsReceiver, delegationApprover, stakerOptOutWindowBlocks]
      const config = [
        await signer.getAddress(),                              // __deprecated_earningsReceiver
        "0x0000000000000000000000000000000000000000",            // delegationApprover (none)
        0                                                       // stakerOptOutWindowBlocks
      ];

    // Extra data can be an empty string if not used.
    const extraData = "";

    console.log("Registering operator with config:", config);

    // Call registerAsOperator.
    const tx = await delegationManager.registerAsOperator(config, extraData);
    console.log("Operator registration transaction sent. Waiting for confirmation...");

    // Wait for the transaction receipt.
    const receipt = await tx.wait();
    console.log("Operator registration successful. Transaction hash:", receipt.transactionHash);

    return receipt.transactionHash;
  } catch (error) {
    console.error("EigenLayer operator registration failed:", error);
    throw new Error("EigenLayer operator registration failed: " + error.message);
  }
}

module.exports = { registerOperatorForService };
