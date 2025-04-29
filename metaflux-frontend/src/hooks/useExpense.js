import { useEffect, useState } from 'react';
import { useAccount, useContractRead, useContractWrite, usePublicClient } from 'wagmi';
import { parseEther } from 'viem';
import { 
  EXPENSE_TRACKER_ABI, 
  EXPENSE_TRACKER_ADDRESS,
  BUDGET_MANAGER_ABI,
  BUDGET_MANAGER_ADDRESS 
} from '../constants/contracts';

export function useExpenses() {
  const { address, isConnected } = useAccount();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const publicClient = usePublicClient();

  // Record expense function
  const { writeAsync: recordExpense, isPending: isRecording } = useContractWrite({
    address: EXPENSE_TRACKER_ADDRESS,
    abi: EXPENSE_TRACKER_ABI,
    functionName: 'recordExpense',
  });

  // Fetch categories from the contract
  const fetchCategories = async () => {
    if (!publicClient) return;
    
    try {
      setIsLoading(true);
      const result = await publicClient.readContract({
        address: EXPENSE_TRACKER_ADDRESS,
        abi: EXPENSE_TRACKER_ABI,
        functionName: 'getCategoryList',
      });
      
      setCategories(result);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user expenses from the contract
  const fetchUserExpenses = async () => {
    if (!address || !isConnected || !publicClient) return;
    
    setIsLoading(true);
    
    try {
      // Get all expenses IDs for the user
      const expenseIds = await publicClient.readContract({
        address: EXPENSE_TRACKER_ADDRESS,
        abi: EXPENSE_TRACKER_ABI,
        functionName: 'getUserExpenses',
        args: [address],
      });
      
      // For each expense ID, get the expense details
      const userExpenses = await Promise.all(
        expenseIds.map(async (id) => {
          try {
            const expense = await publicClient.readContract({
              address: EXPENSE_TRACKER_ADDRESS,
              abi: EXPENSE_TRACKER_ABI,
              functionName: 'getExpense',
              args: [id],
            });
            
            return {
              ...expense,
              id,
            };
          } catch (error) {
            console.error(`Error fetching expense ${id}:`, error);
            return null;
          }
        })
      );
      
      // Sort expenses by timestamp (newest first)
      const sortedExpenses = userExpenses
        .filter(Boolean)
        .sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
      
      setExpenses(sortedExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle recording a new expense
  const handleRecordExpense = async (amount, category, description, isReimbursable = false) => {
    if (!isConnected) return;
    
    try {
      setIsLoading(true);
      const tx = await recordExpense({
        args: [parseEther(amount.toString()), category, description, isReimbursable],
      });
      
      await tx.wait();
      await fetchUserExpenses();
      return { success: true, hash: tx.hash };
    } catch (error) {
      console.error('Error recording expense:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Get expenses by category
  const getExpensesByCategory = async (category) => {
    if (!address || !isConnected || !publicClient) return [];
    
    try {
      const expenseIds = await publicClient.readContract({
        address: EXPENSE_TRACKER_ADDRESS,
        abi: EXPENSE_TRACKER_ABI,
        functionName: 'getUserExpensesByCategory',
        args: [address, category],
      });
      
      const categoryExpenses = await Promise.all(
        expenseIds.map(async (id) => {
          try {
            const expense = await publicClient.readContract({
              address: EXPENSE_TRACKER_ADDRESS,
              abi: EXPENSE_TRACKER_ABI,
              functionName: 'getExpense',
              args: [id],
            });
            
            return {
              ...expense,
              id,
            };
          } catch (error) {
            console.error(`Error fetching expense ${id}:`, error);
            return null;
          }
        })
      );
      
      return categoryExpenses.filter(Boolean);
    } catch (error) {
      console.error(`Error fetching expenses for category ${category}:`, error);
      return [];
    }
  };

  // Fetch categories and expenses on wallet connection or when component mounts
  useEffect(() => {
    fetchCategories();
    
    if (isConnected && address) {
      fetchUserExpenses();
    }
  }, [isConnected, address]);

  return {
    expenses,
    categories,
    isLoading: isLoading || isRecording,
    recordExpense: handleRecordExpense,
    refreshExpenses: fetchUserExpenses,
    getExpensesByCategory,
  };
}