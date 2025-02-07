// generateMnemonic.js
const bip39 = require('bip39');

const mnemonic = bip39.generateMnemonic(); // defaults to 128 bits of entropy (12 words)
console.log("Generated mnemonic phrase:", mnemonic);