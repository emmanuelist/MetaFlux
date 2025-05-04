// src/services/web3/budgetManager.js
import { useWeb3 } from './index';
import { useState, useCallback } from 'react';

// Map enum values to strings and back
const PeriodMap = {
  DAILY: 0,
  WEEKLY: 1,
  MONTHLY: 2, 
  QUARTERLY: 3,
  YEARLY: 4
};

const PeriodLabels = {
  0: 'Daily',
  1: 'Weekly', 
  2: 'Monthly',
  3: 'Quarterly',
  4: 'Yearly'
};

// Helper to format budget data
const formatBudget = (budget, web3) => {
  if (!budget || !budget.isActive) return null;
  
  return {
    amount: web3.utils.fromWei(budget.amount, 'ether'),
    spent: web3.utils.fromWei(budget.spent, 'ether'),
    startTime: new Date(budget.startTime * 1000),
    period: PeriodLabels[budget.period],
    periodEnum: parseInt(budget.period),
    category: budget.category,
    isActive: budget.isActive,
    remaining: web3.utils.fromWei(
      (BigInt(budget.amount) - BigInt(budget.spent)).toString(), 
      'ether'
    ),
    percentage: budget.amount === '0' 
      ? 0 
      : (BigInt(budget.spent) * BigInt(100) / BigInt(budget.amount)).toString()
  };
};

export const useBudgetManager = () => {
  const { web3, accounts, contracts, loading } = useWeb3();
  const [txLoading, setTxLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBudget = useCallback(async (category, amount, period) => {
    if (!contracts.budgetManager || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
      const periodEnum = PeriodMap[period.toUpperCase()];
      
      if (periodEnum === undefined) {
        throw new Error(`Invalid period: ${period}. Must be one of: DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY`);
      }
      
      const receipt = await contracts.budgetManager.methods
        .createBudget(category, amountInWei, periodEnum)
        .send({ from: accounts[0] });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error creating budget:', err);
      setError(err.message || 'Failed to create budget');
      setTxLoading(false);
      throw err;
    }
  }, [web3, accounts, contracts.budgetManager]);

  const updateBudget = useCallback(async (category, newAmount) => {
    if (!contracts.budgetManager || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const newAmountInWei = web3.utils.toWei(newAmount.toString(), 'ether');
      
      const receipt = await contracts.budgetManager.methods
        .updateBudget(category, newAmountInWei)
        .send({ from: accounts[0] });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error updating budget:', err);
      setError(err.message || 'Failed to update budget');
      setTxLoading(false);
      throw err;
    }
  }, [web3, accounts, contracts.budgetManager]);

  const resetBudget = useCallback(async (category) => {
    if (!contracts.budgetManager || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const receipt = await contracts.budgetManager.methods
        .resetBudget(category)
        .send({ from: accounts[0] });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error resetting budget:', err);
      setError(err.message || 'Failed to reset budget');
      setTxLoading(false);
      throw err;
    }
  }, [accounts, contracts.budgetManager]);

  const getBudget = useCallback(async (category, userAddress = null) => {
    if (!contracts.budgetManager) return null;
    
    try {
      const address = userAddress || accounts[0];
      if (!address) throw new Error('No user address provided');
      
      const budget = await contracts.budgetManager.methods
        .getBudget(address, category)
        .call();
      
      return formatBudget(budget, web3);
    } catch (err) {
      console.error('Error fetching budget:', err);
      setError(err.message || 'Failed to fetch budget');
      return null;
    }
  }, [web3, accounts, contracts.budgetManager]);

  const getRemainingBudget = useCallback(async (category, userAddress = null) => {
    if (!contracts.budgetManager) return '0';
    
    try {
      const address = userAddress || accounts[0];
      if (!address) throw new Error('No user address provided');
      
      const remaining = await contracts.budgetManager.methods
        .getRemainingBudget(address, category)
        .call();
      
      return web3.utils.fromWei(remaining, 'ether');
    } catch (err) {
      console.error('Error fetching remaining budget:', err);
      setError(err.message || 'Failed to fetch remaining budget');
      return '0';
    }
  }, [web3, accounts, contracts.budgetManager]);

  const getBudgetPeriodEnd = useCallback(async (category, userAddress = null) => {
    if (!contracts.budgetManager) return null;
    
    try {
      const address = userAddress || accounts[0];
      if (!address) throw new Error('No user address provided');
      
      const periodEnd = await contracts.budgetManager.methods
        .getBudgetPeriodEnd(address, category)
        .call();
      
      return periodEnd === '0' ? null : new Date(periodEnd * 1000);
    } catch (err) {
      console.error('Error fetching budget period end:', err);
      setError(err.message || 'Failed to fetch budget period end');
      return null;
    }
  }, [accounts, contracts.budgetManager]);

  const isBudgetExceeded = useCallback(async (category, userAddress = null) => {
    if (!contracts.budgetManager) return false;
    
    try {
      const address = userAddress || accounts[0];
      if (!address) throw new Error('No user address provided');
      
      return await contracts.budgetManager.methods
        .isBudgetExceeded(address, category)
        .call();
    } catch (err) {
      console.error('Error checking if budget is exceeded:', err);
      setError(err.message || 'Failed to check if budget is exceeded');
      return false;
    }
  }, [accounts, contracts.budgetManager]);

  // Get all budgets for a user by fetching categories first
  const getAllBudgets = useCallback(async (userAddress = null) => {
    if (!contracts.budgetManager || !contracts.expenseTracker) return [];
    
    try {
      const address = userAddress || accounts[0];
      if (!address) throw new Error('No user address provided');
      
      // Get all categories from ExpenseTracker
      const categories = await contracts.expenseTracker.methods
        .getCategoryList()
        .call();
      
      // Fetch budget for each category
      const budgetPromises = categories.map(category => 
        getBudget(category, address)
          .then(budget => ({ category, budget }))
          .catch(() => ({ category, budget: null }))
      );
      
      const results = await Promise.all(budgetPromises);
      
      // Filter out null budgets (inactive or non-existent)
      return results
        .filter(item => item.budget !== null)
        .map(item => ({
          category: item.category,
          ...item.budget
        }));
    } catch (err) {
      console.error('Error fetching all budgets:', err);
      setError(err.message || 'Failed to fetch all budgets');
      return [];
    }
  }, [accounts, contracts.budgetManager, contracts.expenseTracker, getBudget]);

  return {
    createBudget,
    updateBudget,
    resetBudget,
    getBudget,
    getRemainingBudget,
    getBudgetPeriodEnd,
    isBudgetExceeded,
    getAllBudgets,
    periodOptions: Object.keys(PeriodMap),
    loading: loading || txLoading,
    error
  };
};