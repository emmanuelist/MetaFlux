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