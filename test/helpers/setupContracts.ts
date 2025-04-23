// test/helpers/setupContracts.ts

import { ethers } from "hardhat";
import { 
  ExpenseTracker,
  BudgetManager,
  DelegationManager,
  MetaFluxToken,
  NFTBadges,
  RewardsDistributor 
} from "../../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

export async function deployMetaFluxContracts() {
  const [owner, user1, user2, user3] = await ethers.getSigners();
  
  // Deploy ExpenseTracker
  const ExpenseTrackerFactory = await ethers.getContractFactory("ExpenseTracker");
  const expenseTracker = await ExpenseTrackerFactory.deploy();
  await expenseTracker.waitForDeployment();
  
  // Deploy BudgetManager with ExpenseTracker
  const BudgetManagerFactory = await ethers.getContractFactory("BudgetManager");
  const budgetManager = await BudgetManagerFactory.deploy(await expenseTracker.getAddress());
  await budgetManager.waitForDeployment();
  
  // Deploy DelegationManager
  const DelegationManagerFactory = await ethers.getContractFactory("DelegationManager");
  const delegationManager = await DelegationManagerFactory.deploy();
  await delegationManager.waitForDeployment();
  
  // Deploy MetaFluxToken
  const MetaFluxTokenFactory = await ethers.getContractFactory("MetaFluxToken");
  const metaFluxToken = await MetaFluxTokenFactory.deploy();
  await metaFluxToken.waitForDeployment();
  
  // Deploy NFTBadges
  const NFTBadgesFactory = await ethers.getContractFactory("NFTBadges");
  const nftBadges = await NFTBadgesFactory.deploy();
  await nftBadges.waitForDeployment();
  
  // Deploy RewardsDistributor with MetaFluxToken and NFTBadges
  const RewardsDistributorFactory = await ethers.getContractFactory("RewardsDistributor");
  const rewardsDistributor = await RewardsDistributorFactory.deploy(
    await metaFluxToken.getAddress(),
    await nftBadges.getAddress()
  );
  await rewardsDistributor.waitForDeployment();
  
  // Set up permissions
  await metaFluxToken.grantRole(await metaFluxToken.MINTER_ROLE(), await rewardsDistributor.getAddress());
  await nftBadges.grantRole(await nftBadges.MINTER_ROLE(), await rewardsDistributor.getAddress());
  await delegationManager.grantExpenseRecorderRole(await expenseTracker.getAddress());
  
  return {
    expenseTracker,
    budgetManager,
    delegationManager,
    metaFluxToken,
    nftBadges,
    rewardsDistributor,
    owner,
    user1,
    user2,
    user3
  };
}

// test/helpers/eventEmitter.ts

import { ethers } from "hardhat";
import { Contract, EventLog } from "ethers";

export async function getEvents(contract: Contract, eventName: string, blockHash: string) {
  const eventFragment = contract.interface.getEvent(eventName);
  const filter = {
    address: await contract.getAddress(),
    topics: [ethers.id(eventFragment.format('sighash'))],
    blockHash
  };
  
  const logs = await ethers.provider.getLogs(filter);
  return logs.map(log => {
    return contract.interface.parseLog({
      topics: log.topics as string[],
      data: log.data
    });
  });
}