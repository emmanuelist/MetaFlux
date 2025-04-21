// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Records and categorizes expenses on Pharos blockchain

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IExpenseTracker {
    struct Expense {
        uint256 id;
        address user;
        uint256 amount;
        uint256 timestamp;
        string category;
        string description;
        bool isReimbursable;
    }

    event ExpenseRecorded(
        uint256 indexed id,
        address indexed user,
        uint256 amount,
        string category,
        uint256 timestamp
    );
    
    event CategoryAdded(string category);
    event CategoryRemoved(string category);

    function recordExpense(
        uint256 amount,
        string calldata category,
        string calldata description,
        bool isReimbursable
    ) external returns (uint256);
    
    function getExpense(uint256 expenseId) external view returns (Expense memory);
    function getUserExpenses(address user) external view returns (uint256[] memory);
    function getUserExpensesByCategory(address user, string calldata category) external view returns (uint256[] memory);
    function addCategory(string calldata category) external;
    function removeCategory(string calldata category) external;
    function getCategoryList() external view returns (string[] memory);
    function isValidCategory(string calldata category) external view returns (bool);
}

contract ExpenseTracker is IExpenseTracker, Ownable, ReentrancyGuard {
    uint256 private _expenseIdTracker;
    mapping(uint256 => Expense) private _expenses;
    mapping(address => uint256[]) private _userExpenses;
    mapping(address => mapping(string => uint256[])) private _userExpensesByCategory;
    
    string[] private _categories;
    mapping(string => bool) private _validCategories;
    
    constructor() Ownable(msg.sender) {
        // Initialize with default categories
        _addCategoryInternal("Food");
        _addCategoryInternal("Transportation");
        _addCategoryInternal("Accommodation");
        _addCategoryInternal("Entertainment");
        _addCategoryInternal("Utilities");
        _addCategoryInternal("Other");
    }
    
    function recordExpense(
        uint256 amount,
        string calldata category,
        string calldata description,
        bool isReimbursable
    ) external override nonReentrant returns (uint256) {
        require(amount > 0, "ExpenseTracker: Amount must be greater than 0");
        require(isValidCategory(category), "ExpenseTracker: Invalid category");
        
        uint256 expenseId = _expenseIdTracker++;
        
        _expenses[expenseId] = Expense({
            id: expenseId,
            user: msg.sender,
            amount: amount,
            timestamp: block.timestamp,
            category: category,
            description: description,
            isReimbursable: isReimbursable
        });
        
        _userExpenses[msg.sender].push(expenseId);
        _userExpensesByCategory[msg.sender][category].push(expenseId);
        
        emit ExpenseRecorded(expenseId, msg.sender, amount, category, block.timestamp);
        
        return expenseId;
    }
    
    function getExpense(uint256 expenseId) external view override returns (Expense memory) {
        require(_expenses[expenseId].user != address(0), "ExpenseTracker: Expense does not exist");
        return _expenses[expenseId];
    }
    
    function getUserExpenses(address user) external view override returns (uint256[] memory) {
        return _userExpenses[user];
    }
    
    function getUserExpensesByCategory(address user, string calldata category) external view override returns (uint256[] memory) {
        require(isValidCategory(category), "ExpenseTracker: Invalid category");
        return _userExpensesByCategory[user][category];
    }
    
    function addCategory(string calldata category) external override onlyOwner {
        _addCategoryInternal(category);
    }

    function _addCategoryInternal(string memory category) private {
        require(bytes(category).length > 0, "ExpenseTracker: Category cannot be empty");
        require(!_validCategories[category], "ExpenseTracker: Category already exists");
        
        _categories.push(category);
        _validCategories[category] = true;
        
        emit CategoryAdded(category);
    }
    
    function removeCategory(string calldata category) external override onlyOwner {
        require(_validCategories[category], "ExpenseTracker: Category does not exist");
        require(!_isDefaultCategory(category), "ExpenseTracker: Cannot remove default category");
        
        _validCategories[category] = false;
        
        // Remove from categories array
        for (uint256 i = 0; i < _categories.length; i++) {
            if (keccak256(bytes(_categories[i])) == keccak256(bytes(category))) {
                _categories[i] = _categories[_categories.length - 1];
                _categories.pop();
                break;
            }
        }
        
        emit CategoryRemoved(category);
    }
    
    function _isDefaultCategory(string memory category) private pure returns (bool) {
        bytes32 categoryHash = keccak256(bytes(category));
        
        return (
            categoryHash == keccak256(bytes("Food")) ||
            categoryHash == keccak256(bytes("Transportation")) ||
            categoryHash == keccak256(bytes("Accommodation")) ||
            categoryHash == keccak256(bytes("Entertainment")) ||
            categoryHash == keccak256(bytes("Utilities")) ||
            categoryHash == keccak256(bytes("Other"))
        );
    }
    
    function getCategoryList() external view override returns (string[] memory) {
        return _categories;
    }
    
    function isValidCategory(string calldata category) public view override returns (bool) {
        return _validCategories[category];
    }
}