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

    it("should filter expenses by category", async function () {
        // Record food expense
        await expenseTracker.connect(user1).recordExpense(
          ethers.parseEther("1.5"), 
          "Food", 
          "Lunch", 
          false
        );
        
        // Record transportation expense
        await expenseTracker.connect(user1).recordExpense(
          ethers.parseEther("0.5"), 
          "Transportation", 
          "Bus ticket", 
          false
        );
        
        const foodExpenses = await expenseTracker.getUserExpensesByCategory(user1.address, "Food");
        const transportExpenses = await expenseTracker.getUserExpensesByCategory(user1.address, "Transportation");
        
        expect(foodExpenses.length).to.equal(1);
        expect(transportExpenses.length).to.equal(1);
        
        const foodExpense = await expenseTracker.getExpense(foodExpenses[0]);
        expect(foodExpense.category).to.equal("Food");
      });
    });
    
    describe("BudgetManager", function () {
      it("should create and track budgets", async function () {
        // Create a budget
        await budgetManager.connect(user1).createBudget(
          "Food", 
          ethers.parseEther("100"), 
          0 // DAILY
        );
        
        const budget = await budgetManager.getBudget(user1.address, "Food");
        expect(budget.amount).to.equal(ethers.parseEther("100"));
        expect(budget.spent).to.equal(0);
        expect(budget.period).to.equal(0); // DAILY
        expect(budget.isActive).to.equal(true);
        
        // Record expense
        const expenseAmount = ethers.parseEther("30");
        await expenseTracker.connect(user1).recordExpense(
          expenseAmount,
          "Food",
          "Dinner",
          false
        );
        
        // Simulate tracking the expense in BudgetManager
        const userExpenses = await expenseTracker.getUserExpenses(user1.address);
        const expense = await expenseTracker.getExpense(userExpenses[0]);
        
        await budgetManager.trackExpense(
          user1.address,
          expense.amount,
          expense.category
        );
        
        // Check updated budget
        const updatedBudget = await budgetManager.getBudget(user1.address, "Food");
        expect(updatedBudget.spent).to.equal(expenseAmount);
        
        // Check remaining budget
        const remainingBudget = await budgetManager.getRemainingBudget(user1.address, "Food");
        expect(remainingBudget).to.equal(ethers.parseEther("70")); // 100 - 30
      });
      
      it("should handle budget period expiration", async function () {
        // Create a daily budget
        await budgetManager.connect(user1).createBudget(
          "Food", 
          ethers.parseEther("100"), 
          0 // DAILY
        );
        
        // Record expense
        await budgetManager.trackExpense(
          user1.address,
          ethers.parseEther("30"),
          "Food"
        );
        
        // Move time forward by 25 hours (more than a day)
        await time.increase(25 * 60 * 60);
        
        // Record another expense
        await budgetManager.trackExpense(
          user1.address,
          ethers.parseEther("20"),
          "Food"
        );
        
        // Should have reset the budget after period expired
        const updatedBudget = await budgetManager.getBudget(user1.address, "Food");
        expect(updatedBudget.spent).to.equal(ethers.parseEther("20")); // Only the new expense
      });

      it("should emit threshold exceeded events", async function () {
        // Create a budget
        await budgetManager.connect(user1).createBudget(
          "Food", 
          ethers.parseEther("100"), 
          0 // DAILY
        );
        
        // 75% of budget
        await expect(
          budgetManager.trackExpense(user1.address, ethers.parseEther("75"), "Food")
        ).to.emit(budgetManager, "BudgetThresholdExceeded")
          .withArgs(user1.address, "Food", 75, 75);
        
        // Additional 15% (now at 90%)
        await expect(
          budgetManager.trackExpense(user1.address, ethers.parseEther("15"), "Food")
        ).to.emit(budgetManager, "BudgetThresholdExceeded")
          .withArgs(user1.address, "Food", 90, 90);
        
        // Additional 15% (now at 105%)
        await expect(
          budgetManager.trackExpense(user1.address, ethers.parseEther("15"), "Food")
        ).to.emit(budgetManager, "BudgetThresholdExceeded")
          .withArgs(user1.address, "Food", 100, 105);
      });
    });
    
    describe("DelegationManager", function () {
      it("should create and track delegations", async function () {
        // Create a delegation (admin: user1, delegate: user2)
        const spendLimit = ethers.parseEther("100");
        const expiryDuration = 7 * 24 * 60 * 60; // 7 days in seconds
        
        await delegationManager.connect(user1).createDelegation(
          user2.address,
          spendLimit,
          expiryDuration
        );
        
        // Check delegation details
        const delegation = await delegationManager.getDelegation(user1.address, user2.address);
        expect(delegation.admin).to.equal(user1.address);
        expect(delegation.delegate).to.equal(user2.address);
        expect(delegation.spendLimit).to.equal(spendLimit);
        expect(delegation.spentAmount).to.equal(0);
        expect(delegation.isActive).to.equal(true);
        
        // Check delegation relationships
        const user1Delegates = await delegationManager.getAdminDelegates(user1.address);
        const user2Admins = await delegationManager.getDelegateAdmins(user2.address);
        
        expect(user1Delegates.length).to.equal(1);
        expect(user1Delegates[0]).to.equal(user2.address);
        expect(user2Admins.length).to.equal(1);
        expect(user2Admins[0]).to.equal(user1.address);
      });
      
      it("should update delegations correctly", async function () {
        // Create a delegation
        await delegationManager.connect(user1).createDelegation(
          user2.address,
          ethers.parseEther("100"),
          7 * 24 * 60 * 60
        );
        
        // Update delegation
        const newSpendLimit = ethers.parseEther("200");
        const newExpiryDuration = 14 * 24 * 60 * 60; // 14 days
        
        await delegationManager.connect(user1).updateDelegation(
          user2.address,
          newSpendLimit,
          newExpiryDuration
        );
        
        // Check updated delegation
        const delegation = await delegationManager.getDelegation(user1.address, user2.address);
        expect(delegation.spendLimit).to.equal(newSpendLimit);
      });
      
      it("should revoke delegations", async function () {
        // Create a delegation
        await delegationManager.connect(user1).createDelegation(
          user2.address,
          ethers.parseEther("100"),
          7 * 24 * 60 * 60
        );
        
        // Revoke delegation
        await delegationManager.connect(user1).revokeDelegation(user2.address);
        
        // Check delegation status
        const delegation = await delegationManager.getDelegation(user1.address, user2.address);
        expect(delegation.isActive).to.equal(false);
        
        const isActive = await delegationManager.isDelegationActive(user1.address, user2.address);
        expect(isActive).to.equal(false);
      });
    });
    
    describe("MetaFluxToken", function () {
      it("should initialize correctly", async function () {
        const name = await metaFluxToken.name();
        const symbol = await metaFluxToken.symbol();
        const decimals = await metaFluxToken.decimals();
        
        expect(name).to.equal("MetaFlux Token");
        expect(symbol).to.equal("MFT");
        expect(decimals).to.equal(18);
      });
      
      it("should allow minting by authorized addresses", async function () {
        const mintAmount = ethers.parseEther("1000");
        await metaFluxToken.mint(user1.address, mintAmount);
        
        const balance = await metaFluxToken.balanceOf(user1.address);
        expect(balance).to.equal(mintAmount);
      });
      
      it("should prevent unauthorized minting", async function () {
        const mintAmount = ethers.parseEther("1000");
        await expect(metaFluxToken.connect(user1).mint(user1.address, mintAmount))
          .to.be.revertedWithCustomError(metaFluxToken, "AccessControlUnauthorizedAccount");
      });
    });
    
    describe("NFTBadges", function () {
      it("should initialize with default badges", async function () {
        // Check first badge
        const firstBadge = await nftBadges.getBadgeMetadata(0);
        expect(firstBadge.name).to.equal("First Steps");
        expect(firstBadge.rarity).to.equal(1);
        expect(firstBadge.isActive).to.equal(true);
      });
      
      it("should mint badges correctly", async function () {
        // Mint a badge to user1
        await nftBadges.connect(owner).mintBadge(user1.address, 0);
        
        // Check user has badge
        const hasBadge = await nftBadges.hasBadge(user1.address, 0);
        expect(hasBadge).to.equal(true);
        
        // Check badge mint count
        const mintCount = await nftBadges.getBadgeMintCount(0);
        expect(mintCount).to.equal(1);
      });

      it("should allow creating new badges with proper role", async function () {
        await nftBadges.connect(owner).createBadge(
          "Super Saver",
          "Saved over 1000 PHAR",
          "ipfs://badge/super_saver.json",
          4 // Rarity
        );
        
        const newBadgeId = 5; // (0-4 are default, so new one is 5)
        const exists = await nftBadges.exists(newBadgeId);
        expect(exists).to.equal(true);
        
        const badge = await nftBadges.getBadgeMetadata(newBadgeId);
        expect(badge.name).to.equal("Super Saver");
        expect(badge.rarity).to.equal(4);
      });
    });
    
    describe("RewardsDistributor", function () {
      it("should initialize with default achievements", async function () {
        // Check first achievement
        const firstAchievement = await rewardsDistributor.getAchievement(0);
        expect(firstAchievement.name).to.equal("First Steps");
        expect(firstAchievement.tokenReward).to.equal(50);
        expect(firstAchievement.isActive).to.equal(true);
      });
      
      it("should award achievements to users", async function () {
        // Award achievement to user1
        await rewardsDistributor.connect(owner).awardAchievement(user1.address, 0);
        
        // Check user achievements
        const userAchievements = await rewardsDistributor.getUserAchievements(user1.address);
        expect(userAchievements.length).to.equal(1);
        expect(userAchievements[0].id).to.equal(0);
        expect(userAchievements[0].name).to.equal("First Steps");
        expect(userAchievements[0].claimed).to.equal(false);
      });
      
      it("should allow users to claim rewards", async function () {
        // Award achievement
        await rewardsDistributor.connect(owner).awardAchievement(user1.address, 0);
        
        // Claim rewards
        await rewardsDistributor.connect(user1).claimRewards(0);
        
        // Check token balance
        const tokenBalance = await metaFluxToken.balanceOf(user1.address);
        expect(tokenBalance).to.equal(50); // 50 tokens for first achievement
        
        // Check badge ownership
        const hasBadge = await nftBadges.hasBadge(user1.address, 0);
        expect(hasBadge).to.equal(true);
        
        // Check achievement is marked as claimed
        const userAchievements = await rewardsDistributor.getUserAchievements(user1.address);
        expect(userAchievements[0].claimed).to.equal(true);
      });
      
      it("should track next achievement milestones", async function () {
        // Award one achievement
        await rewardsDistributor.connect(owner).awardAchievement(user1.address, 0);
        
        // Get next milestones
        const nextMilestones = await rewardsDistributor.getNextAchievementMilestones(user1.address);
        
        // Should have the remaining milestones (out of 5 total)
        expect(nextMilestones.length).to.equal(4);
        
        // First milestone should not be included (already awarded)
        const containsFirstAchievement = nextMilestones.some(m => m.name === "First Steps");
        expect(containsFirstAchievement).to.equal(false);
      });
    });
    
    describe("Integration Tests", function () {
      it("should handle complete expense recording flow with budgets", async function () {
        // 1. Create a budget
        await budgetManager.connect(user1).createBudget(
          "Food", 
          ethers.parseEther("100"), 
          0 // DAILY
        );
        
        // 2. Record an expense
        const expenseAmount = ethers.parseEther("30");
        await expenseTracker.connect(user1).recordExpense(
          expenseAmount,
          "Food",
          "Lunch",
          false
        );
        
        // 3. Manually track the expense in BudgetManager (in a real implementation this would be triggered by an event)
        const userExpenses = await expenseTracker.getUserExpenses(user1.address);
        const expense = await expenseTracker.getExpense(userExpenses[0]);
        
        await budgetManager.trackExpense(
          user1.address,
          expense.amount,
          expense.category
        );
        
        // 4. Check updated budget
        const updatedBudget = await budgetManager.getBudget(user1.address, "Food");
        expect(updatedBudget.spent).to.equal(expenseAmount);
        
        // 5. Award achievement for first expense
        await rewardsDistributor.connect(owner).awardAchievement(user1.address, 0); // First Steps
        
        // 6. Claim rewards
        await rewardsDistributor.connect(user1).claimRewards(0);
        
        // 7. Check token balance and badge
        const tokenBalance = await metaFluxToken.balanceOf(user1.address);
        expect(tokenBalance).to.equal(50); // 50 tokens for first achievement
        
        const hasBadge = await nftBadges.hasBadge(user1.address, 0);
        expect(hasBadge).to.equal(true);
      });
      
      it("should handle delegation and expense tracking flow", async function () {
        // 1. Create a delegation from user1 to user2
        await delegationManager.connect(user1).createDelegation(
          user2.address,
          ethers.parseEther("100"),
          7 * 24 * 60 * 60 // 7 days
        );
        
        // 2. Setup roles to allow expense tracking
        await delegationManager.grantExpenseRecorderRole(owner.address);
        
        // 3. Record a delegated expense (would normally happen via ExpenseTracker)
        // For simplicity, we're calling directly
        const expenseAmount = ethers.parseEther("30");
        
        // Simulate tx.origin being user2 (delegate)
        // In a real scenario, this would be triggered by user2 making a transaction
        await delegationManager.recordDelegatedSpend(
          user1.address, // admin
          user2.address, // delegate
          expenseAmount
        );
        
        // 4. Check updated delegation
        const delegation = await delegationManager.getDelegation(user1.address, user2.address);
        expect(delegation.spentAmount).to.equal(expenseAmount);
        
        // 5. Check remaining spend limit
        const remainingLimit = await delegationManager.getRemainingSpendLimit(user1.address, user2.address);
        expect(remainingLimit).to.equal(ethers.parseEther("70")); // 100 - 30
      });
    });
  });