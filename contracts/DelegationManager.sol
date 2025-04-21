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

contract DelegationManager is IDelegationManager, AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant EXPENSE_RECORDER_ROLE = keccak256("EXPENSE_RECORDER_ROLE");
    
    // admin address => delegate address => Delegation
    mapping(address => mapping(address => Delegation)) private _delegations;
    
    // admin address => list of delegate addresses
    mapping(address => address[]) private _adminDelegates;
    
    // delegate address => list of admin addresses
    mapping(address => address[]) private _delegateAdmins;
    
    // Mapping to check if a delegation exists (for faster lookups)
    mapping(address => mapping(address => bool)) private _delegationExists;
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    function createDelegation(
        address delegate,
        uint256 spendLimit,
        uint256 expiryDuration
    ) external override nonReentrant {
        require(delegate != address(0), "DelegationManager: Invalid delegate address");
        require(delegate != msg.sender, "DelegationManager: Cannot delegate to self");
        require(spendLimit > 0, "DelegationManager: Spend limit must be greater than 0");
        require(!_delegationExists[msg.sender][delegate], "DelegationManager: Delegation already exists");
        
        uint256 expiryTime = block.timestamp + expiryDuration;
        
        _delegations[msg.sender][delegate] = Delegation({
            admin: msg.sender,
            delegate: delegate,
            spendLimit: spendLimit,
            spentAmount: 0,
            expiryTime: expiryTime,
            isActive: true
        });
        
        _adminDelegates[msg.sender].push(delegate);
        _delegateAdmins[delegate].push(msg.sender);
        _delegationExists[msg.sender][delegate] = true;
        
        emit DelegationCreated(msg.sender, delegate, spendLimit, expiryTime);
    }
    
    function updateDelegation(
        address delegate,
        uint256 newSpendLimit,
        uint256 newExpiryDuration
    ) external override nonReentrant {
        require(_delegationExists[msg.sender][delegate], "DelegationManager: Delegation does not exist");
        require(newSpendLimit > 0, "DelegationManager: Spend limit must be greater than 0");
        
        Delegation storage delegation = _delegations[msg.sender][delegate];
        require(delegation.isActive, "DelegationManager: Delegation is not active");
        
        uint256 newExpiryTime = block.timestamp + newExpiryDuration;
        
        delegation.spendLimit = newSpendLimit;
        delegation.expiryTime = newExpiryTime;
        
        emit DelegationUpdated(msg.sender, delegate, newSpendLimit, newExpiryTime);
    }