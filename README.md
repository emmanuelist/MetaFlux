# MetaFlux Finance

MetaFlux Finance is a comprehensive blockchain-based expense management and financial tracking system built on the Pharos blockchain. It provides robust tools for expense tracking, budget management, delegation controls, and rewards.

## Overview

MetaFlux creates a complete financial management ecosystem with several integrated components:

- **ExpenseTracker**: Records and categorizes expenses
- **BudgetManager**: Sets and enforces spending budgets
- **DelegationManager**: Facilitates controlled spending delegation between users
- **RewardsDistributor**: Rewards users for financial achievements
- **MetaFluxToken (MFT)**: ERC-20 token for rewards and potential governance
- **NFTBadges**: ERC-721 tokens representing achievements

## Smart Contracts

### ExpenseTracker.sol

Records and categorizes expenses with key features:
- Track expenses by category with descriptions and reimbursement status
- Predefined and customizable expense categories
- Query user expenses by category or in aggregate

```solidity
function recordExpense(
    uint256 amount,
    string calldata category,
    string calldata description,
    bool isReimbursable
) external returns (uint256);
```

### BudgetManager.sol

Sets and enforces spending budgets:
- Create budgets for different expense categories
- Define budget periods (daily, weekly, monthly, quarterly, yearly)
- Monitor spending and get notifications when approaching budget thresholds
- Automatic budget reset at period end

```solidity
function createBudget(
    string calldata category,
    uint256 amount,
    Period period
) external;
```

### DelegationManager.sol

Handles spending delegation between users:
- Delegate spending permissions with customizable limits
- Set expiration times for delegations
- Track and manage delegated spending
- View delegation relationships

```solidity
function createDelegation(
    address delegate,
    uint256 spendLimit,
    uint256 expiryDuration
) external;
```

### RewardsDistributor.sol

Manages achievement-based rewards:
- Track user achievements
- Distribute token rewards
- Award NFT badges for milestones
- View achievement progress

```solidity
function awardAchievement(
    address user,
    uint256 achievementId
) external;
```

### MetaFluxToken.sol

ERC-20 token used for rewards and potential platform governance.

### NFTBadges.sol

ERC-721 tokens representing achievements and milestones:

- Tiered badge system with different rarity levels
- Metadata storage for badge attributes
- Customizable badge properties

## Getting Started

### Prerequisites

- Node.js v14+ and npm
- Hardhat
- MetaMask or other Ethereum wallet

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/metaflux.git
cd metaflux
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
npx hardhat vars set ACCOUNT_PRIVATE_KEY
# Enter your wallet's private key when prompted
```

### Compilation

Compile the smart contracts:

```bash
npx hardhat compile
```

### Testing

Run the test suite:
```bash
npx hardhat test
```

Run tests with gas reporting:
```bash
REPORT_GAS=true npx hardhat test
```

Check test coverage:
```bash
npx hardhat coverage
```

## Architecture

MetaFlux follows a modular design with separate contracts for distinct functionality that interact through well-defined interfaces:

1. **User Layer**: Direct interaction with ExpenseTracker and BudgetManager
2. **Delegation Layer**: Controlled spending permissions via DelegationManager
3. **Incentive Layer**: Rewards and achievements via RewardsDistributor, MetaFluxToken, and NFTBadges

## Security Features

- OpenZeppelin contracts for standard implementations
- Access control with role-based permissions
- Reentrancy protection for financial operations
- Comprehensive validation checks
