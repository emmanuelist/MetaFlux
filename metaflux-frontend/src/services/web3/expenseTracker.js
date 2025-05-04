// src/services/web3/expenseTracker.js
import { useWeb3 } from './index';
import { useState, useCallback } from 'react';

export const useExpenseTracker = () => {
  const { web3, accounts, contracts, loading } = useWeb3();
  const [txLoading, setTxLoading] = useState(false);
  const [error, setError] = useState(null);

  const recordExpense = useCallback(async (amount, category, description, isReimbursable) => {
    if (!contracts.expenseTracker || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
      
      const gasEstimate = await contracts.expenseTracker.methods
        .recordExpense(amountInWei, category, description, isReimbursable)
        .estimateGas({ from: accounts[0] });
      
      const receipt = await contracts.expenseTracker.methods
        .recordExpense(amountInWei, category, description, isReimbursable)
        .send({ 
          from: accounts[0],
          gas: Math.floor(gasEstimate * 1.2) // Add 20% buffer to gas estimate
        });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error recording expense:', err);
      setError(err.message || 'Failed to record expense');
      setTxLoading(false);
      throw err;
    }
  }, [web3, accounts, contracts.expenseTracker]);

  const getExpense = useCallback(async (expenseId) => {
    if (!contracts.expenseTracker) return null;
    
    try {
      const expense = await contracts.expenseTracker.methods
        .getExpense(expenseId)
        .call();
        
      return {
        id: expense.id,
        user: expense.user,
        amount: web3.utils.fromWei(expense.amount, 'ether'),
        timestamp: new Date(expense.timestamp * 1000),
        category: expense.category,
        description: expense.description,
        isReimbursable: expense.isReimbursable
      };
    } catch (err) {
      console.error('Error fetching expense:', err);
      setError(err.message || 'Failed to fetch expense');
      return null;
    }
  }, [web3, contracts.expenseTracker]);

  const getUserExpenses = useCallback(async (user = null) => {
    if (!contracts.expenseTracker) return [];
    
    try {
      const address = user || accounts[0];
      if (!address) throw new Error('No user address provided');
      
      const expenseIds = await contracts.expenseTracker.methods
        .getUserExpenses(address)
        .call();
      
      const expenses = await Promise.all(
        expenseIds.map(id => getExpense(id))
      );
      
      return expenses.filter(e => e !== null);
    } catch (err) {
      console.error('Error fetching user expenses:', err);
      setError(err.message || 'Failed to fetch user expenses');
      return [];
    }
  }, [accounts, contracts.expenseTracker, getExpense]);

  const getUserExpensesByCategory = useCallback(async (category, user = null) => {
    if (!contracts.expenseTracker) return [];
    
    try {
      const address = user || accounts[0];
      if (!address) throw new Error('No user address provided');
      
      const expenseIds = await contracts.expenseTracker.methods
        .getUserExpensesByCategory(address, category)
        .call();
      
      const expenses = await Promise.all(
        expenseIds.map(id => getExpense(id))
      );
      
      return expenses.filter(e => e !== null);
    } catch (err) {
      console.error('Error fetching expenses by category:', err);
      setError(err.message || 'Failed to fetch expenses by category');
      return [];
    }
  }, [accounts, contracts.expenseTracker, getExpense]);

  const getCategoryList = useCallback(async () => {
    if (!contracts.expenseTracker) return [];
    
    try {
      const categories = await contracts.expenseTracker.methods
        .getCategoryList()
        .call();
      
      return categories;
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to fetch categories');
      return [];
    }
  }, [contracts.expenseTracker]);

  const isValidCategory = useCallback(async (category) => {
    if (!contracts.expenseTracker) return false;
    
    try {
      return await contracts.expenseTracker.methods
        .isValidCategory(category)
        .call();
    } catch (err) {
      console.error('Error checking category validity:', err);
      setError(err.message || 'Failed to check category validity');
      return false;
    }
  }, [contracts.expenseTracker]);

  // For admin use only
  const addCategory = useCallback(async (category) => {
    if (!contracts.expenseTracker || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const receipt = await contracts.expenseTracker.methods
        .addCategory(category)
        .send({ from: accounts[0] });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error adding category:', err);
      setError(err.message || 'Failed to add category');
      setTxLoading(false);
      throw err;
    }
  }, [accounts, contracts.expenseTracker]);

  // For admin use only
  const removeCategory = useCallback(async (category) => {
    if (!contracts.expenseTracker || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const receipt = await contracts.expenseTracker.methods
        .removeCategory(category)
        .send({ from: accounts[0] });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error removing category:', err);
      setError(err.message || 'Failed to remove category');
      setTxLoading(false);
      throw err;
    }
  }, [accounts, contracts.expenseTracker]);

  return {
    recordExpense,
    getExpense,
    getUserExpenses,
    getUserExpensesByCategory,
    getCategoryList,
    isValidCategory,
    addCategory,
    removeCategory,
    loading: loading || txLoading,
    error
  };
};