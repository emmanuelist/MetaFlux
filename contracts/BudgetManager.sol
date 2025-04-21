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

contract BudgetManager is IBudgetManager, Ownable {
    IExpenseTracker private _expenseTracker;
    
    // user address => category => Budget
    mapping(address => mapping(string => Budget)) private _budgets;
    
    // Thresholds for notifications (75%, 90%, 100%)
    uint8[] private _thresholds = [75, 90, 100];
    
    // Track which thresholds have been triggered
    mapping(address => mapping(string => mapping(uint8 => bool))) private _thresholdTriggered;
    
    constructor(address expenseTrackerAddress) Ownable(msg.sender) {
        _expenseTracker = IExpenseTracker(expenseTrackerAddress);
    }
    
    function createBudget(
        string calldata category,
        uint256 amount,
        Period period
    ) external override {
        require(_expenseTracker.isValidCategory(category), "BudgetManager: Invalid category");
        require(amount > 0, "BudgetManager: Budget amount must be greater than 0");
        require(!_budgets[msg.sender][category].isActive, "BudgetManager: Budget already exists");
        
        _budgets[msg.sender][category] = Budget({
            amount: amount,
            spent: 0,
            startTime: block.timestamp,
            period: period,
            category: category,
            isActive: true
        });
        
        emit BudgetCreated(msg.sender, category, amount, period);
    }
    
    function updateBudget(string calldata category, uint256 newAmount) external override {
        require(_expenseTracker.isValidCategory(category), "BudgetManager: Invalid category");
        require(newAmount > 0, "BudgetManager: Budget amount must be greater than 0");
        require(_budgets[msg.sender][category].isActive, "BudgetManager: Budget does not exist");
        
        Budget storage budget = _budgets[msg.sender][category];
        budget.amount = newAmount;
        
        // Reset threshold triggers when budget is updated
        for (uint256 i = 0; i < _thresholds.length; i++) {
            _thresholdTriggered[msg.sender][category][_thresholds[i]] = false;
        }
        
        emit BudgetUpdated(msg.sender, category, newAmount);
    }
    
    function trackExpense(
        address user,
        uint256 amount,
        string calldata category
    ) external override {
        Budget storage budget = _budgets[user][category];
        
        if (!budget.isActive) {
            return; // No budget set for this category
        }
        
        // Check if budget period has expired and reset if needed
        if (_isBudgetPeriodExpired(user, category)) {
            _resetBudgetInternal(user, category);
        }
        
        // Update spent amount
        budget.spent += amount;
        
        // Check thresholds and emit events
        uint256 percentage = (budget.spent * 100) / budget.amount;
        
        for (uint256 i = 0; i < _thresholds.length; i++) {
            uint8 threshold = _thresholds[i];
            
            if (percentage >= threshold && !_thresholdTriggered[user][category][threshold]) {
                _thresholdTriggered[user][category][threshold] = true;
                emit BudgetThresholdExceeded(user, category, threshold, percentage);
            }
        }
    }

    function _isBudgetPeriodExpired(address user, string calldata category) private view returns (bool) {
        Budget storage budget = _budgets[user][category];
        uint256 periodDuration = _getPeriodDuration(budget.period);
        
        return (block.timestamp > budget.startTime + periodDuration);
    }
    
    function _getPeriodDuration(Period period) private pure returns (uint256) {
        if (period == Period.DAILY) {
            return 1 days;
        } else if (period == Period.WEEKLY) {
            return 7 days;
        } else if (period == Period.MONTHLY) {
            return 30 days;
        } else if (period == Period.QUARTERLY) {
            return 90 days;
        } else if (period == Period.YEARLY) {
            return 365 days;
        }
        
        revert("BudgetManager: Invalid period");
    }
    
    function _resetBudgetInternal(address user, string memory category) private {
        Budget storage budget = _budgets[user][category];
        
        budget.spent = 0;
        budget.startTime = block.timestamp;
        
        // Reset threshold triggers
        for (uint256 i = 0; i < _thresholds.length; i++) {
            _thresholdTriggered[user][category][_thresholds[i]] = false;
        }
    }
    
    function resetBudget(string calldata category) external override {
        require(_budgets[msg.sender][category].isActive, "BudgetManager: Budget does not exist");
        
        _resetBudgetInternal(msg.sender, category);
        
        emit BudgetReset(msg.sender, category);
    }
    
    function getBudget(address user, string calldata category) external view override returns (Budget memory) {
        return _budgets[user][category];
    }
    
    function getRemainingBudget(address user, string calldata category) external view override returns (uint256) {
        Budget storage budget = _budgets[user][category];
        
        if (!budget.isActive) {
            return 0;
        }
        
        if (budget.spent >= budget.amount) {
            return 0;
        }
        
        return budget.amount - budget.spent;
    }