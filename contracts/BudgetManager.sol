// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// BudgetManager.sol 
// Sets and enforces spending budgets

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ExpenseTracker.sol";

interface IBudgetManager {
    enum Period { DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY }
    
    struct Budget {
        uint256 amount;
        uint256 spent;
        uint256 startTime;
        Period period;
        string category;
        bool isActive;
    }
    
    event BudgetCreated(
        address indexed user,
        string category,
        uint256 amount,
        Period period
    );
    
    event BudgetUpdated(
        address indexed user,
        string category, 
        uint256 newAmount
    );
    
    event BudgetReset(
        address indexed user,
        string category
    );
    
    event BudgetThresholdExceeded(
        address indexed user,
        string category,
        uint256 threshold,
        uint256 current
    );
    
    function createBudget(string calldata category, uint256 amount, Period period) external;
    function updateBudget(string calldata category, uint256 newAmount) external;
    function trackExpense(address user, uint256 amount, string calldata category) external;
    function getBudget(address user, string calldata category) external view returns (Budget memory);
    function resetBudget(string calldata category) external;
    function getRemainingBudget(address user, string calldata category) external view returns (uint256);
    function getBudgetPeriodEnd(address user, string calldata category) external view returns (uint256);
    function isBudgetExceeded(address user, string calldata category) external view returns (bool);
}