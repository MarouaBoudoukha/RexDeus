
require('dotenv').config();
const { ethers } = require("ethers");
import { JsonRpcProvider } from 'ethers';


// Holesky contract addresses.
const lsETHTokenAddress = "0x8c1bed5b9a0928467c9b1341da1d7bd5e10b6549"; // e.g., the lsETH token contract address
const strategyManagerAddress = "0xdfB5f6CE42aAA7830E94ECFCcAd411beF4d4D5b6"; // Holesky The central StrategyManager contract 
const strategyAddress = "0x05037A81BD7B4C9E0F7B430f1F2A22c31a2FD943"; // The specific strategy handling lsETH deposits
const delegationManagerAddress = "0xA44151489861Fe9e3055d95adC98FbD462B948e7"; // The DelegationManager contract (if delegation is used)

// Minimal ERC20 ABI for the approval function.
const ERC20_ABI = [
    [{"inputs":[{"internalType":"address","name":"_logic","type":"address"},{"internalType":"address","name":"__admin","type":"address"},{"internalType":"address","name":"_upgradeManager","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"stateMutability":"payable","type":"constructor"},{"inputs":[],"name":"CallWhenPaused","type":"error"},{"inputs":[{"internalType":"address","name":"_implementation","type":"address"}],"name":"UnauthorizedImplementation","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"admin","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"admin","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"upgradeManager","type":"address"}],"name":"UpgradeManagerSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"value","type":"bool"}],"name":"UpgradeSafePathUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_newUpgradeManager","type":"address"}],"name":"setUpgradeManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"upgradeManager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]
];

// Minimal ABI for the StrategyManager, showing the deposit function.
const StrategyManager_ABI = [
    [{"inputs":[{"internalType":"address","name":"_logic","type":"address"},{"internalType":"address","name":"admin_","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"admin_","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"implementation_","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]
];

// Minimal ABI for the DelegationManager for delegation.
const DelegationManager_ABI = [
    [{"inputs":[{"internalType":"address","name":"_logic","type":"address"},{"internalType":"address","name":"admin_","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"admin_","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"implementation_","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]    
];

async function main() {
  try {
    // Set up provider using your RPC URL from the .env file.
    const provider = new ethers.providers.JsonRpcProvider("https://eth-holesky.g.alchemy.com/v2/6lsSIg_B0EQ4yOIssBcYSsQqqicNnEd5");

    // Create a signer (wallet) using your private key from the .env file.
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log("Using signer address:", signer.address);

    // Create contract instances.
    const lsETHToken = new ethers.Contract(lsETHTokenAddress, ERC20_ABI, signer);
    const strategyManager = new ethers.Contract(strategyManagerAddress, StrategyManager_ABI, signer);
    const delegationManager = new ethers.Contract(delegationManagerAddress, DelegationManager_ABI, signer);

    // Define the deposit amount (for example, 10 lsETH; assuming 18 decimals).
    const depositAmount = ethers.utils.parseUnits("0.01", 18);

    // Step 1: Approve the StrategyManager contract to spend your lsETH tokens.
    console.log("Approving the StrategyManager to spend lsETH...");
    let tx = await lsETHToken.approve(strategyManagerAddress, depositAmount);
    console.log("Waiting for approval transaction to be mined...");
    await tx.wait();
    console.log("Approval successful.");

    // Step 2: Deposit (restake) your lsETH into the chosen strategy.
    console.log("Depositing lsETH into the strategy...");
    tx = await strategyManager.depositIntoStrategy(strategyAddress, lsETHTokenAddress, depositAmount);
    console.log("Waiting for deposit transaction to be mined...");
    await tx.wait();
    console.log("Deposit (restaking) successful.");

    // Optional: Delegate your restaked assets to an operator.
    // Replace the operator address below with the actual operator you wish to delegate to.
    const operatorAddress = "0xcaaeb411241ac87b5846797c15bf339a54a1d736";
    console.log("Delegating restaked assets to operator:", operatorAddress);
    tx = await delegationManager.delegateTo(operatorAddress, "0x", "0x");
    console.log("Waiting for delegation transaction to be mined...");
    await tx.wait();
    console.log("Delegation successful.");

  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Run the main function.
main();
