// src/eigenLayerHandlers.js
const { registerOperatorForService } = require('./utils/eigenLayerIntegration');

/**
 * Handler for operator registration/delegation on EigenLayer.
 *
 * @param {Object} params - (Optional) Additional parameters.
 * @returns {Promise<Object>} - The result of the operator registration.
 */
async function handleRegisterOperator(params) {
  try {
    const txHash = await registerOperatorForService();
    return {
      status: 'success',
      action: 'register_operator',
      details: `Operator registered. Transaction Hash: ${txHash}`,
    };
  } catch (error) {
    console.error("Error in handleRegisterOperator:", error);
    return { status: 'error', message: error.message || error.toString() };
  }
}

module.exports = { handleRegisterOperator };
