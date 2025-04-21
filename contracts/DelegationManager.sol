// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// DelegationManager.sol
// Handles spending delegation between users

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IDelegationManager {
    struct Delegation {
        address admin;
        address delegate;
        uint256 spendLimit;
        uint256 spentAmount;
        uint256 expiryTime;
        bool isActive;
    }
    
    event DelegationCreated(
        address indexed admin,
        address indexed delegate,
        uint256 spendLimit,
        uint256 expiryTime
    );
    
    event DelegationUpdated(
        address indexed admin,
        address indexed delegate,
        uint256 newSpendLimit,
        uint256 newExpiryTime
    );
    
    event DelegationRevoked(
        address indexed admin,
        address indexed delegate
    );
    
    event DelegatedSpendRecorded(
        address indexed admin, 
        address indexed delegate,
        uint256 amount
    );
    
    function createDelegation(address delegate, uint256 spendLimit, uint256 expiryDuration) external;
    function updateDelegation(address delegate, uint256 newSpendLimit, uint256 newExpiryDuration) external;
    function revokeDelegation(address delegate) external;
    function recordDelegatedSpend(address admin, uint256 amount) external returns (bool);
    function getDelegation(address admin, address delegate) external view returns (Delegation memory);
    function isDelegationActive(address admin, address delegate) external view returns (bool);
    function getRemainingSpendLimit(address admin, address delegate) external view returns (uint256);
    function getAdminDelegates(address admin) external view returns (address[] memory);
    function getDelegateAdmins(address delegate) external view returns (address[] memory);
}