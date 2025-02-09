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
        return await handleCreateItem(parameters);
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
