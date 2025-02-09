require('dotenv').config();
const { ethers } = require("ethers");
// import { JsonRpcProvider } from 'ethers';


// Holesky contract addresses.
const lsETHTokenAddress = "0x8c1bed5b9a0928467c9b1341da1d7bd5e10b6549"; // e.g., the lsETH token contract address
const strategyManagerAddress = "0x7798625888ECf3EB2c3c74Dc2746e09d72747679"; // Holesky The central StrategyManager contract 
const strategyAddress = "0x5FdD6a71a3C88111474C812Ca6d60942d7923C1e"; // The specific strategy handling lsETH deposits
const delegationManagerAddress = "0xDa6F662777aDB5209644cF5cf1A61A2F8a99BF48"; // The DelegationManager contract (if delegation is used)

// ERC20 ABI for the approval function.
const ERC20_ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
]


// ABI for the StrategyManager, showing the deposit function.
const StrategyManager_ABI = [{"inputs":[{"internalType":"contract IEigenPodManager","name":"_eigenPodManager","type":"address"},{"internalType":"contract IAllocationManager","name":"_allocationManager","type":"address"},{"internalType":"contract IPauserRegistry","name":"_pauserRegistry","type":"address"},{"internalType":"contract IPermissionController","name":"_permissionController","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"_strategy","type":"address"},{"internalType":"address","name":"_token","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"depositIntoStrategy","outputs":[],"stateMutability":"nonpayable","type":"function"}];

// ABI for the Strategy contract.
const Strategy_ABI = [
    {
        "inputs":[
            {"internalType":"contract IStrategyManager","name":"_strategyManager","type":"address"},
            {"internalType":"contract IPauserRegistry","name":"_pauserRegistry","type":"address"}
        ],
        "stateMutability":"nonpayable",
        "type":"constructor"
    },
    {"inputs":[],"name":"BalanceExceedsMaxTotalDeposits","type":"error"},
    {"inputs":[],"name":"CurrentlyPaused","type":"error"},
    {"inputs":[],"name":"InputAddressZero","type":"error"},
    {"inputs":[],"name":"InvalidNewPausedStatus","type":"error"},
    {"inputs":[],"name":"MaxPerDepositExceedsMax","type":"error"},
    {"inputs":[],"name":"NewSharesZero","type":"error"},
    {"inputs":[],"name":"OnlyPauser","type":"error"},
    {"inputs":[],"name":"OnlyStrategyManager","type":"error"},
    {"inputs":[],"name":"OnlyUnderlyingToken","type":"error"},
    {"inputs":[],"name":"OnlyUnpauser","type":"error"},
    {"inputs":[],"name":"TotalSharesExceedsMax","type":"error"},
    {"inputs":[],"name":"WithdrawalAmountExceedsTotalDeposits","type":"error"},
    {
        "anonymous":false,
        "inputs":[{"indexed":false,"internalType":"uint256","name":"rate","type":"uint256"}],
        "name":"ExchangeRateEmitted",
        "type":"event"
    },
    {
        "anonymous":false,
        "inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],
        "name":"Initialized",
        "type":"event"
    },
    {
        "anonymous":false,
        "inputs":[
            {"indexed":false,"internalType":"uint256","name":"previousValue","type":"uint256"},
            {"indexed":false,"internalType":"uint256","name":"newValue","type":"uint256"}
        ],
        "name":"MaxPerDepositUpdated",
        "type":"event"
    },
    {
        "anonymous":false,
        "inputs":[
            {"indexed":false,"internalType":"uint256","name":"previousValue","type":"uint256"},
            {"indexed":false,"internalType":"uint256","name":"newValue","type":"uint256"}
        ],
        "name":"MaxTotalDepositsUpdated",
        "type":"event"
    },
    {
        "anonymous":false,
        "inputs":[
            {"indexed":true,"internalType":"address","name":"account","type":"address"},
            {"indexed":false,"internalType":"uint256","name":"newPausedStatus","type":"uint256"}
        ],
        "name":"Paused",
        "type":"event"
    },
    {
        "anonymous":false,
        "inputs":[
            {"indexed":false,"internalType":"contract IERC20","name":"token","type":"address"},
            {"indexed":false,"internalType":"uint8","name":"decimals","type":"uint8"}
        ],
        "name":"StrategyTokenSet",
        "type":"event"
    },
    {
        "anonymous":false,
        "inputs":[
            {"indexed":true,"internalType":"address","name":"account","type":"address"},
            {"indexed":false,"internalType":"uint256","name":"newPausedStatus","type":"uint256"}
        ],
        "name":"Unpaused",
        "type":"event"
    },
    {
        "inputs":[
            {"internalType":"contract IERC20","name":"token","type":"address"},
            {"internalType":"uint256","name":"amount","type":"uint256"}
        ],
        "name":"deposit",
        "outputs":[{"internalType":"uint256","name":"newShares","type":"uint256"}],
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"explanation",
        "outputs":[{"internalType":"string","name":"","type":"string"}],
        "stateMutability":"pure",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"getTVLLimits",
        "outputs":[
            {"internalType":"uint256","name":"","type":"uint256"},
            {"internalType":"uint256","name":"","type":"uint256"}
        ],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[
            {"internalType":"uint256","name":"_maxPerDeposit","type":"uint256"},
            {"internalType":"uint256","name":"_maxTotalDeposits","type":"uint256"},
            {"internalType":"contract IERC20","name":"_underlyingToken","type":"address"}
        ],
        "name":"initialize",
        "outputs":[],
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {
        "inputs":[{"internalType":"contract IERC20","name":"_underlyingToken","type":"address"}],
        "name":"initialize",
        "outputs":[],
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {"inputs":[],"name":"maxPerDeposit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"maxTotalDeposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"newPausedStatus","type":"uint256"}],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"pauseAll","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint8","name":"index","type":"uint8"}],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"paused","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"pauserRegistry","outputs":[{"internalType":"contract IPauserRegistry","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {
        "inputs":[
            {"internalType":"uint256","name":"newMaxPerDeposit","type":"uint256"},
            {"internalType":"uint256","name":"newMaxTotalDeposits","type":"uint256"}
        ],
        "name":"setTVLLimits",
        "outputs":[],
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {
        "inputs":[{"internalType":"address","name":"user","type":"address"}],
        "name":"shares",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[{"internalType":"uint256","name":"amountShares","type":"uint256"}],
        "name":"sharesToUnderlying",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[{"internalType":"uint256","name":"amountShares","type":"uint256"}],
        "name":"sharesToUnderlyingView",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {"inputs":[],"name":"strategyManager","outputs":[{"internalType":"contract IStrategyManager","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"totalShares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {
        "inputs":[{"internalType":"uint256","name":"amountUnderlying","type":"uint256"}],
        "name":"underlyingToShares",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[{"internalType":"uint256","name":"amountUnderlying","type":"uint256"}],
        "name":"underlyingToSharesView",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {"inputs":[],"name":"underlyingToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {
        "inputs":[{"internalType":"uint256","name":"newPausedStatus","type":"uint256"}],
        "name":"unpause",
        "outputs":[],
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {
        "inputs":[{"internalType":"address","name":"user","type":"address"}],
        "name":"userUnderlying",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {
        "inputs":[{"internalType":"address","name":"user","type":"address"}],
        "name":"userUnderlyingView",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[
            {"internalType":"address","name":"recipient","type":"address"},
            {"internalType":"contract IERC20","name":"token","type":"address"},
            {"internalType":"uint256","name":"amountShares","type":"uint256"}
        ],
        "name":"withdraw",
        "outputs":[],
        "stateMutability":"nonpayable",
        "type":"function"
    }
];

// ABI for the DelegationManager contract.
const DelegationManager_ABI = [
    // Constructor
    {
      "inputs": [
        { "internalType": "contract IStrategyManager", "name": "_strategyManager", "type": "address" },
        { "internalType": "contract IEigenPodManager", "name": "_eigenPodManager", "type": "address" },
        { "internalType": "contract IAllocationManager", "name": "_allocationManager", "type": "address" },
        { "internalType": "contract IPauserRegistry", "name": "_pauserRegistry", "type": "address" },
        { "internalType": "contract IPermissionController", "name": "_permissionController", "type": "address" },
        { "internalType": "uint32", "name": "_MIN_WITHDRAWAL_DELAY", "type": "uint32" }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    // Errors
    { "inputs": [], "name": "ActivelyDelegated", "type": "error" },
    { "inputs": [], "name": "CallerCannotUndelegate", "type": "error" },
    { "inputs": [], "name": "CurrentlyPaused", "type": "error" },
    { "inputs": [], "name": "FullySlashed", "type": "error" },
    { "inputs": [], "name": "InputAddressZero", "type": "error" },
    { "inputs": [], "name": "WithdrawalNotQueued", "type": "error" },
    { "inputs": [], "name": "WithdrawerNotCaller", "type": "error" },
    // Events
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "staker", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }
      ],
      "name": "StakerDelegated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": false, "internalType": "bytes32", "name": "withdrawalRoot", "type": "bytes32" },
        { "indexed": false, "internalType": "uint256[]", "name": "sharesToWithdraw", "type": "uint256[]" }
      ],
      "name": "SlashingWithdrawalQueued",
      "type": "event"
    },
    // Functions
    {
      "inputs": [
        { "internalType": "address", "name": "staker", "type": "address" }
      ],
      "name": "getQueuedWithdrawals",
      "outputs": [
        {
          "components": [
            { "internalType": "address", "name": "staker", "type": "address" },
            { "internalType": "address", "name": "delegatedTo", "type": "address" },
            { "internalType": "address", "name": "withdrawer", "type": "address" },
            { "internalType": "uint96", "name": "nonce", "type": "uint96" },
            { "internalType": "uint32", "name": "startBlock", "type": "uint32" },
            { "internalType": "address[]", "name": "strategies", "type": "address[]" }
          ],
          "internalType": "struct IDelegationManagerTypes.Withdrawal[]",
          "name": "withdrawals",
          "type": "tuple[]"
        },
        { "internalType": "uint256[][]", "name": "shares", "type": "uint256[][]" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            { "internalType": "address[]", "name": "strategies", "type": "address[]" },
            { "internalType": "uint256[]", "name": "shares", "type": "uint256[]" },
            { "internalType": "address", "name": "withdrawer", "type": "address" }
          ],
          "internalType": "struct IDelegationManagerTypes.QueuedWithdrawal[]",
          "name": "queuedWithdrawals",
          "type": "tuple[]"
        }
      ],
      "name": "queueWithdrawals",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            { "internalType": "address", "name": "staker", "type": "address" },
            { "internalType": "address", "name": "delegatedTo", "type": "address" },
            { "internalType": "address", "name": "withdrawer", "type": "address" },
            { "internalType": "uint96", "name": "nonce", "type": "uint96" },
            { "internalType": "uint32", "name": "startBlock", "type": "uint32" },
            { "internalType": "address[]", "name": "strategies", "type": "address[]" }
          ],
          "internalType": "struct IDelegationManagerTypes.Withdrawal",
          "name": "withdrawal",
          "type": "tuple"
        },
        { "internalType": "address[]", "name": "tokens", "type": "address[]" },
        { "internalType": "bool", "name": "receiveAsTokens", "type": "bool" }
      ],
      "name": "completeQueuedWithdrawal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "operator", "type": "address" },
        {
          "components": [
            { "internalType": "bytes", "name": "signature", "type": "bytes" },
            { "internalType": "uint256", "name": "expiry", "type": "uint256" }
          ],
          "internalType": "struct ISignatureUtils.SignatureWithExpiry",
          "name": "approverSignatureAndExpiry",
          "type": "tuple"
        },
        { "internalType": "bytes32", "name": "approverSalt", "type": "bytes32" }
      ],
      "name": "delegateTo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
  





// Utility to create provider and signer.
// Utility to create provider and signer.
// Import ethers.js
const { ethers } = require("ethers");

// Utility to create provider and signer
function getSigner() {
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.RPC_URL || "https://eth-holesky.g.alchemy.com/v2/6lsSIg_B0EQ4yOIssBcYSsQqqicNnEd5"
    );
    return new ethers.Wallet(process.env.PRIVATE_KEY, provider);
}

// Function to approve ERC-20 spending for restaking
async function approveToken(spender, amount) {
    const signer = getSigner();
    const lsETHToken = new ethers.Contract(lsETHTokenAddress, ERC20_ABI, signer);

    console.log("Approving StrategyManager to spend lsETH...");
    const tx = await lsETHToken.approve(spender, amount);
    await tx.wait();
    console.log("✅ Approval successful.");
}

// Function to deposit (restake) lsETH into the StrategyManager
async function depositStake(depositAmount) {
    const signer = getSigner();
    const strategyManager = new ethers.Contract(strategyManagerAddress, StrategyManager_ABI, signer);

    console.log("Depositing lsETH into StrategyManager...");
    const tx = await strategyManager.depositIntoStrategy(strategyAddress, lsETHTokenAddress, depositAmount);
    await tx.wait();
    console.log("✅ Deposit successful.");
}

// Function to queue a withdrawal
async function queueWithdrawal(lsETHAmount, withdrawerAddress) {
    const signer = getSigner();
    const delegationManager = new ethers.Contract(delegationManagerAddress, DelegationManager_ABI, signer);
    const strategyContract = new ethers.Contract(strategyAddress, [
        "function underlyingToShares(uint256 underlyingAmount) external view returns (uint256)"
    ], signer);

    console.log(`Converting ${ethers.utils.formatUnits(lsETHAmount, 18)} lsETH to strategy shares...`);
    const shareAmount = await strategyContract.underlyingToShares(lsETHAmount);
    console.log(`Converted to ${ethers.utils.formatUnits(shareAmount, 18)} strategy shares.`);

    const queuedWithdrawalParams = [{
        strategies: [strategyAddress],
        shares: [shareAmount],
        withdrawer: withdrawerAddress
    }];

    console.log("Queueing withdrawal...");
    const tx = await delegationManager.queueWithdrawals(queuedWithdrawalParams);
    const receipt = await tx.wait();
    
    const queueBlock = await signer.provider.getBlock(receipt.blockNumber);
    const queueTimestamp = queueBlock.timestamp;

    console.log(`✅ Withdrawal queued at block ${receipt.blockNumber}, timestamp: ${queueTimestamp}`);

    return { queueBlockNumber: receipt.blockNumber, queueTimestamp };
}

// Function to check if withdrawal is ready
async function isWithdrawalReady(queueTimestamp) {
    const now = Math.floor(Date.now() / 1000); // Current UNIX time (seconds)
    const escrowDuration = 7 * 24 * 60 * 60; // 7 days in seconds

    return now >= queueTimestamp + escrowDuration;
}

// Function to retrieve queued withdrawals
async function getQueuedWithdrawals(stakerAddress) {
    const signer = getSigner();
    const delegationManager = new ethers.Contract(delegationManagerAddress, DelegationManager_ABI, signer);
    const [withdrawals, shares] = await delegationManager.getQueuedWithdrawals(stakerAddress);

    return withdrawals.map((withdrawal, index) => ({
        staker: withdrawal.staker,
        delegatedTo: withdrawal.delegatedTo,
        withdrawer: withdrawal.withdrawer,
        nonce: withdrawal.nonce,
        startBlock: withdrawal.startBlock,
        strategies: withdrawal.strategies,
        shares: shares[index]
    }));
}

// Function to complete a queued withdrawal
async function completeWithdrawal(stakerAddress, withdrawalIndex = 0, receiveAsTokens = true) {
    const signer = getSigner();
    const delegationManager = new ethers.Contract(delegationManagerAddress, DelegationManager_ABI, signer);

    const queuedWithdrawals = await getQueuedWithdrawals(stakerAddress);
    if (queuedWithdrawals.length === 0) {
        throw new Error("❌ No queued withdrawals found.");
    }

    const withdrawalToComplete = queuedWithdrawals[withdrawalIndex];
    const strategies = withdrawalToComplete.strategies;
    const tokens = strategies.map(() => lsETHTokenAddress);

    const withdrawalReady = await isWithdrawalReady(withdrawalToComplete.startBlock);
    if (!withdrawalReady) {
        console.log("⏳ Withdrawal not yet ready. Try again after 7 days.");
        return;
    }

    console.log("✅ Escrow period elapsed. Completing withdrawal...");
    const tx = await delegationManager.completeQueuedWithdrawal(
        withdrawalToComplete,
        tokens,
        receiveAsTokens
    );
    await tx.wait();
    console.log("✅ Withdrawal completed successfully.");
}

// Function to delegate the staked assets to an operator
async function delegateStake(operatorAddress) {
    const signer = getSigner();
    const delegationManager = new ethers.Contract(delegationManagerAddress, DelegationManager_ABI, signer);

    console.log("Delegating to operator:", operatorAddress);
    const tx = await delegationManager.delegateTo(operatorAddress, "0x", "0x");
    await tx.wait();
    console.log("✅ Delegation successful.");
}

// Main function to run the process
async function main() {
    try {
        const signer = getSigner();
        const withdrawerAddress = await signer.getAddress();

        console.log(`Using wallet address: ${withdrawerAddress}`);

        const amount = ethers.utils.parseUnits("0.01", 18);

        // Approve the token for spending
        await approveToken(strategyManagerAddress, amount);

        // Deposit (Restake) the lsETH
        await depositStake(amount);

        // Delegate the staked assets to an operator
        const operatorAddress = "0x5accc90436492f24e6af278569691e2c942a676d";
        await delegateStake(operatorAddress);

        // Queue the withdrawal and get timestamps
        const { queueTimestamp } = await queueWithdrawal(amount, withdrawerAddress);

        console.log(`⏳ Withdrawal queued. You must wait at least 7 days before withdrawing.`);

        console.log("⏳ You can run the script again to complete the withdrawal after 7 days.");

    } catch (error) {
        console.error("❌ An error occurred:", error);
    }
}

// Run the main function
main();