// scripts/deploy.ts

import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Deploy ExpenseTracker
  const ExpenseTracker = await ethers.getContractFactory("ExpenseTracker");
  const expenseTracker = await ExpenseTracker.deploy();
  await expenseTracker.waitForDeployment();
  console.log("ExpenseTracker deployed to:", await expenseTracker.getAddress());
  
  // Deploy BudgetManager
  const BudgetManager = await ethers.getContractFactory("BudgetManager");
  const budgetManager = await BudgetManager.deploy(await expenseTracker.getAddress());
  await budgetManager.waitForDeployment();
  console.log("BudgetManager deployed to:", await budgetManager.getAddress());
  
  // Deploy DelegationManager
  const DelegationManager = await ethers.getContractFactory("DelegationManager");
  const delegationManager = await DelegationManager.deploy();
  await delegationManager.waitForDeployment();
  console.log("DelegationManager deployed to:", await delegationManager.getAddress());
  
  // Deploy MetaFluxToken
  const MetaFluxToken = await ethers.getContractFactory("MetaFluxToken");
  const metaFluxToken = await MetaFluxToken.deploy();
  await metaFluxToken.waitForDeployment();
  console.log("MetaFluxToken deployed to:", await metaFluxToken.getAddress());
  
  // Deploy NFTBadges
  const NFTBadges = await ethers.getContractFactory("NFTBadges");
  const nftBadges = await NFTBadges.deploy();
  await nftBadges.waitForDeployment();
  console.log("NFTBadges deployed to:", await nftBadges.getAddress());
  
  // Deploy RewardsDistributor
  const RewardsDistributor = await ethers.getContractFactory("RewardsDistributor");
  const rewardsDistributor = await RewardsDistributor.deploy(
    await metaFluxToken.getAddress(),
    await nftBadges.getAddress()
  );
  await rewardsDistributor.waitForDeployment();
  console.log("RewardsDistributor deployed to:", await rewardsDistributor.getAddress());
  
  // Set up permissions
  console.log("Setting up permissions...");
  
  // Grant MINTER_ROLE to RewardsDistributor in MetaFluxToken
  const minterRole = await metaFluxToken.MINTER_ROLE();
  await metaFluxToken.grantRole(minterRole, await rewardsDistributor.getAddress());
  console.log("Granted MINTER_ROLE to RewardsDistributor in MetaFluxToken");
  
  // Grant MINTER_ROLE to RewardsDistributor in NFTBadges
  await nftBadges.grantRole(minterRole, await rewardsDistributor.getAddress());
  console.log("Granted MINTER_ROLE to RewardsDistributor in NFTBadges");
  
  // Grant EXPENSE_RECORDER_ROLE to ExpenseTracker in DelegationManager
  const expenseRecorderRole = await delegationManager.EXPENSE_RECORDER_ROLE();
  await delegationManager.grantExpenseRecorderRole(await expenseTracker.getAddress());
  console.log("Granted EXPENSE_RECORDER_ROLE to ExpenseTracker in DelegationManager");
  
  console.log("Deployment complete!");
  
  // Return deployed contract addresses for verification
  return {
    ExpenseTracker: await expenseTracker.getAddress(),
    BudgetManager: await budgetManager.getAddress(),
    DelegationManager: await delegationManager.getAddress(),
    MetaFluxToken: await metaFluxToken.getAddress(),
    NFTBadges: await nftBadges.getAddress(),
    RewardsDistributor: await rewardsDistributor.getAddress()
  };
}

// Execute the deployment
main()
  .then((addresses) => {
    console.log("Deployed contract addresses:", addresses);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });