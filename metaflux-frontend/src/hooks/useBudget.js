import { useEffect, useState } from 'react';
import { useAccount, useContractRead, useContractWrite, usePublicClient } from 'wagmi';
import { parseEther } from 'viem';
import { BUDGET_MANAGER_ABI, BUDGET_MANAGER_ADDRESS } from '../../../contracts/BudgetManager.sol';

export function useBudget() {
  const { address, isConnected } = useAccount();
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const publicClient = usePublicClient();

  // Create budget function
  const { writeAsync: createBudget, isPending: isCreating } = useContractWrite({
    address: BUDGET_MANAGER_ADDRESS,
    abi: BUDGET_MANAGER_ABI,
    functionName: 'createBudget',
  });

  // Update budget function
  const { writeAsync: updateBudget, isPending: isUpdating } = useContractWrite({
    address: BUDGET_MANAGER_ADDRESS,
    abi: BUDGET_MANAGER_ABI,
    functionName: 'updateBudget',
  });

  // Reset budget function
  const { writeAsync: resetBudget, isPending: isResetting } = useContractWrite({
    address: BUDGET_MANAGER_ADDRESS,
    abi: BUDGET_MANAGER_ABI,
    functionName: 'resetBudget',
  });

  // Set up budget creation function
  const handleCreateBudget = async (category, amount, period) => {
    if (!isConnected) return;
    
    try {
      setIsLoading(true);
      const tx = await createBudget({
        args: [category, parseEther(amount.toString()), period],
      });
      
      await tx.wait();
      await fetchUserBudgets();
      return { success: true, hash: tx.hash };
    } catch (error) {
      console.error('Error creating budget:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Set up budget update function
  const handleUpdateBudget = async (category, newAmount) => {
    if (!isConnected) return;
    
    try {
      setIsLoading(true);
      const tx = await updateBudget({
        args: [category, parseEther(newAmount.toString())],
      });
      
      await tx.wait();
      await fetchUserBudgets();
      return { success: true, hash: tx.hash };
    } catch (error) {
      console.error('Error updating budget:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset budget function
  const handleResetBudget = async (category) => {
    if (!isConnected) return;
    
    try {
      setIsLoading(true);
      const tx = await resetBudget({
        args: [category],
      });
      
      await tx.wait();
      await fetchUserBudgets();
      return { success: true, hash: tx.hash };
    } catch (error) {
      console.error('Error resetting budget:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user budgets from the contract
  const fetchUserBudgets = async () => {
    if (!address || !isConnected || !publicClient) return;
    
    setIsLoading(true);
    
    try {
      // Get all categories from the expense tracker
      const categories = await publicClient.readContract({
        address: BUDGET_MANAGER_ADDRESS,
        abi: BUDGET_MANAGER_ABI,
        functionName: 'getCategoryList',
      });
      
      // For each category, check if there's a budget
      const userBudgets = await Promise.all(
        categories.map(async (category) => {
          try {
            const budget = await publicClient.readContract({
              address: BUDGET_MANAGER_ADDRESS,
              abi: BUDGET_MANAGER_ABI,
              functionName: 'getBudget',
              args: [address, category],
            });
            
            // Only return active budgets
            if (budget.isActive) {
              const remaining = await publicClient.readContract({
                address: BUDGET_MANAGER_ADDRESS,
                abi: BUDGET_MANAGER_ABI,
                functionName: 'getRemainingBudget',
                args: [address, category],
              });
              
              const periodEnd = await publicClient.readContract({
                address: BUDGET_MANAGER_ADDRESS,
                abi: BUDGET_MANAGER_ABI,
                functionName: 'getBudgetPeriodEnd',
                args: [address, category],
              });
              
              return {
                ...budget,
                remaining,
                periodEnd,
                category,
              };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching budget for ${category}:`, error);
            return null;
          }
        })
      );
      
      setBudgets(userBudgets.filter(Boolean));
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch budgets on wallet connection or when component mounts
  useEffect(() => {
    if (isConnected && address) {
      fetchUserBudgets();
    }
  }, [isConnected, address]);

  return {
    budgets,
    isLoading: isLoading || isCreating || isUpdating || isResetting,
    createBudget: handleCreateBudget,
    updateBudget: handleUpdateBudget,
    resetBudget: handleResetBudget,
    refreshBudgets: fetchUserBudgets,
  };
}