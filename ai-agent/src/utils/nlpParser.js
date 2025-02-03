// src/utils/nlpParser.js
const axios = require('axios');

async function parseIntent(message, contextHistory = []) {
  const systemPrompt = "You are a helpful AI agent that extracts structured intent information from user commands for a gaming application. Return your answer in JSON format with keys 'intent', 'itemType', and 'parameters'. For example: {\"intent\": \"create_item\", \"itemType\": \"NFT_Character\", \"parameters\": {\"description\": \"friend\"}}.";

  const messages = [
    { role: "system", content: systemPrompt },
    ...contextHistory,
    { role: "user", content: message }
  ];

  const apiKey = process.env.OPENAI_API_KEY;
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.3,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      }
    }
  );

  const assistantMessage = response.data.choices[0].message.content;
  let parsed;
  try {
    parsed = JSON.parse(assistantMessage);
  } catch (error) {
    console.error("Error parsing JSON from ChatGPT:", error);
    parsed = { error: "Failed to parse response", raw: assistantMessage };
  }

  const updatedContext = [
    ...contextHistory,
    { role: "user", content: message },
    { role: "assistant", content: assistantMessage }
  ];

  return { parsed, updatedContext };
}

module.exports = { parseIntent };
