// src/decisionEngine.js
const { handleCreateItem, handleDeployToken, handleSpawnBabyAI } = require('./actionHandlers');
const { handleRegisterOperator } = require('./eigenLayerHandlers');

async function routeIntent(intentObj) {
  if (!intentObj || !intentObj.intent) {
    return { status: 'error', message: 'Invalid intent object' };
  }

  const { intent, itemType, parameters } = intentObj;

  switch (intent) {
    case 'create_item':
      if (itemType === 'NFT_Character' || itemType === 'Game_Asset') {
        // First, mint the NFT for the smart NPC.
        const createResult = await handleCreateItem(parameters);
        if (createResult.status === 'success') {
          // Automatically register the operator after creating the NFT.
          const registerResult = await handleRegisterOperator({});
          return {
            status: 'success',
            action: 'create_item_with_operator',
            details: `Created NFT: ${createResult.details}\nOperator Registration: ${registerResult.details}`
          };
        }
        return createResult;
      }
      break;
    case 'deploy_token':
      return await handleDeployToken(parameters);
    case 'spawn_baby_ai':
      return await handleSpawnBabyAI(parameters);
    case 'register_operator': //intent for operator registration/delegation.
      return await handleRegisterOperator(parameters);
    default:
      return { status: 'error', message: 'Unknown intent' };
  }
}

module.exports = { routeIntent };
