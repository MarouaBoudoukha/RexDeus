// test-nlp.js
require('dotenv').config();

const { parseIntent } = require('./src/utils/nlpParser');

(async () => {
  try {
    const { parsed, updatedContext } = await parseIntent("I need you to create a friend for me.", []);
    console.log("Parsed Intent:", parsed);
    console.log("Updated Context:", updatedContext);
  } catch (error) {
    console.error("NLP Test Error:", error);
  }
})();
