// src/index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { parseIntent } = require('./utils/nlpParser');
const { routeIntent } = require('./decisionEngine');
const { spawnBabyAI } = require('./agent');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Global conversation context for demonstration purposes.
let conversationContext = [];

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ status: 'error', message: 'Message is required' });
  }

  try {
    // Use NLP module with context.
    const { parsed, updatedContext } = await parseIntent(message, conversationContext);
    conversationContext = updatedContext;
    console.log('Parsed Intent:', parsed);

    // Route the parsed intent.
    const actionResult = await routeIntent(parsed);

    // if the intent is to spawn Baby AI, process that.
    if (parsed.intent === 'spawn_baby_ai' && parsed.parameters && parsed.parameters.count) {
      for (let i = 0; i < parsed.parameters.count; i++) {
        await spawnBabyAI(`baby_${i + 1}`);
      }
    }

    return res.status(200).json(actionResult);
  } catch (error) {
    console.error('Error processing message:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`AI Agent listening on port ${port}`);
});
