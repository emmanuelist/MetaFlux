// src/contracts/abis/BudgetManagerABI.js

export const BudgetManagerABI = [
    {
      "inputs": [
        { "internalType": "address", "name": "expenseTrackerAddress", "type": "address" }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
        { "indexed": false, "internalType": "string", "name": "category", "type": "string" },
        { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
        { "indexed": false, "internalType": "enum IBudgetManager.Period", "name": "period", "type": "uint8" }
      ],
      "name": "BudgetCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
        { "indexed": false, "internalType": "string", "name": "category", "type": "string" }
      ],
      "name": "BudgetReset",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
        { "indexed": false, "internalType": "string", "name": "category", "type": "string" },
        { "indexed": false, "internalType": "uint256", "name": "threshold", "type": "uint256" },
        { "indexed": false, "internalType": "uint256", "name": "current", "type": "uint256" }
      ],
      "name": "BudgetThresholdExceeded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
        { "indexed": false, "internalType": "string", "name": "category", "type": "string" },
        { "indexed": false, "internalType": "uint256", "name": "newAmount", "type": "uint256" }
      ],
      "name": "BudgetUpdated",
      "type": "event"
    },
    {
      "inputs": [
        { "internalType": "string", "name": "category", "type": "string" },
        { "internalType": "uint256", "name": "amount", "type": "uint256" },
        { "internalType": "enum IBudgetManager.Period", "name": "period", "type": "uint8" }
      ],
      "name": "createBudget",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "user", "type": "address" },
        { "internalType": "string", "name": "category", "type": "string" }
      ],
      "name": "getBudget",
      "outputs": [
        {
          "components": [
            { "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "internalType": "uint256", "name": "spent", "type": "uint256" },
            { "internalType": "uint256", "name": "startTime", "type": "uint256" },
            { "internalType": "enum IBudgetManager.Period", "name": "period", "type": "uint8" },
            { "internalType": "string", "name": "category", "type": "string" },
            { "internalType": "bool", "name": "isActive", "type": "bool" }
          ],
          "internalType": "struct IBudgetManager.Budget",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "user", "type": "address" },
        { "internalType": "string", "name": "category", "type": "string" }
      ],
      "name": "getBudgetPeriodEnd",
      "outputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "user", "type": "address" },
        { "internalType": "string", "name": "category", "type": "string" }
      ],
      "name": "getRemainingBudget",
      "outputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "user", "type": "address" },
        { "internalType": "string", "name": "category", "type": "string" }
      ],
      "name": "isBudgetExceeded",
      "outputs": [
        { "internalType": "bool", "name": "", "type": "bool" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "string", "name": "category", "type": "string" }
      ],
      "name": "resetBudget",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "user", "type": "address" },
        { "internalType": "uint256", "name": "amount", "type": "uint256" },
        { "internalType": "string", "name": "category", "type": "string" }
      ],
      "name": "trackExpense",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "string", "name": "category", "type": "string" },
        { "internalType": "uint256", "name": "newAmount", "type": "uint256" }
      ],
      "name": "updateBudget",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
  
  export default { abi: BudgetManagerABI };