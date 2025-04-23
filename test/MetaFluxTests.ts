// test/MetaFluxTests.ts

import { expect } from "chai";
import { ethers } from "hardhat";
import { 
  ExpenseTracker,
  BudgetManager,
  DelegationManager,
  MetaFluxToken,
  NFTBadges,
  RewardsDistributor 
} from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("MetaFlux Contracts", function () {
  let expenseTracker: ExpenseTracker;
  let budgetManager: BudgetManager;
  let delegationManager: DelegationManager;
  let metaFluxToken: MetaFluxToken;
  let nftBadges: NFTBadges;
  let rewardsDistributor: RewardsDistributor;
  
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2, user3] = await ethers.getSigners();
    
    // Deploy ExpenseTracker
    const ExpenseTrackerFactory = await ethers.getContractFactory("ExpenseTracker");
    expenseTracker = await ExpenseTrackerFactory.deploy();
    await expenseTracker.waitForDeployment();
    
    // Deploy BudgetManager with ExpenseTracker
    const BudgetManagerFactory = await ethers.getContractFactory("BudgetManager");
    budgetManager = await BudgetManagerFactory.deploy(await expenseTracker.getAddress());
    await budgetManager.waitForDeployment();
    
    // Deploy DelegationManager
    const DelegationManagerFactory = await ethers.getContractFactory("DelegationManager");
    delegationManager = await DelegationManagerFactory.deploy();
    await delegationManager.waitForDeployment();
    
    // Deploy MetaFluxToken
    const MetaFluxTokenFactory = await ethers.getContractFactory("MetaFluxToken");
    metaFluxToken = await MetaFluxTokenFactory.deploy();
    await metaFluxToken.waitForDeployment();
    
    // Deploy NFTBadges
    const NFTBadgesFactory = await ethers.getContractFactory("NFTBadges");
    nftBadges = await NFTBadgesFactory.deploy();
    await nftBadges.waitForDeployment();
    
    // Deploy RewardsDistributor with MetaFluxToken and NFTBadges
    const RewardsDistributorFactory = await ethers.getContractFactory("RewardsDistributor");
    rewardsDistributor = await RewardsDistributorFactory.deploy(
      await metaFluxToken.getAddress(),
      await nftBadges.getAddress()
    );
    await rewardsDistributor.waitForDeployment();
    
    // Grant roles
    await metaFluxToken.grantRole(await metaFluxToken.MINTER_ROLE(), await rewardsDistributor.getAddress());
    await nftBadges.grantRole(await nftBadges.MINTER_ROLE(), await rewardsDistributor.getAddress());
    await delegationManager.grantExpenseRecorderRole(await expenseTracker.getAddress());
  });
  
  describe("ExpenseTracker", function () {
    it("should initialize with default categories", async function () {
      const categories = await expenseTracker.getCategoryList();
      expect(categories).to.include.members(["Food", "Transportation", "Accommodation", "Entertainment", "Utilities", "Other"]);
    });
    
    it("should allow adding new categories (owner only)", async function () {
      await expenseTracker.addCategory("Business");
      const categories = await expenseTracker.getCategoryList();
      expect(categories).to.include("Business");
    });
    
    it("should not allow non-owners to add categories", async function () {
      await expect(expenseTracker.connect(user1).addCategory("Personal"))
        .to.be.revertedWithCustomError(expenseTracker, "OwnableUnauthorizedAccount");
    });
    
    it("should record expenses correctly", async function () {
      const amount = ethers.parseEther("1.5");
      const category = "Food";
      const description = "Lunch";
      const isReimbursable = true;
      
      await expenseTracker.connect(user1).recordExpense(amount, category, description, isReimbursable);
      
      const userExpenses = await expenseTracker.getUserExpenses(user1.address);
      expect(userExpenses.length).to.equal(1);
      
      const expenseId = userExpenses[0];
      const expense = await expenseTracker.getExpense(expenseId);
      
      expect(expense.user).to.equal(user1.address);
      expect(expense.amount).to.equal(amount);
      expect(expense.category).to.equal(category);
      expect(expense.description).to.equal(description);
      expect(expense.isReimbursable).to.equal(isReimbursable);
    });