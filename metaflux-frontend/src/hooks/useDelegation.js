import { useEffect, useState } from 'react';
import { useAccount, useContractRead, useContractWrite, usePublicClient } from 'wagmi';
import { parseEther } from 'viem';
import { DELEGATION_MANAGER_ABI, DELEGATION_MANAGER_ADDRESS } from '../constants/contracts';

export function useDelegation() {
  const { address, isConnected } = useAccount();
  const [delegations, setDelegations] = useState([]);
  const [delegates, setDelegates] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const publicClient = usePublicClient();

  // Create delegation function
  const { writeAsync: createDelegation, isPending: isCreating } = useContractWrite({
    address: DELEGATION_MANAGER_ADDRESS,
    abi: DELEGATION_MANAGER_ABI,
    functionName: 'createDelegation',
  });

  // Update delegation function
  const { writeAsync: updateDelegation, isPending: isUpdating } = useContractWrite({
    address: DELEGATION_MANAGER_ADDRESS,
    abi: DELEGATION_MANAGER_ABI,
    functionName: 'updateDelegation',
  });

  // Revoke delegation function
  const { writeAsync: revokeDelegation, isPending: isRevoking } = useContractWrite({
    address: DELEGATION_MANAGER_ADDRESS,
    abi: DELEGATION_MANAGER_ABI,
    functionName: 'revokeDelegation',
  });

  // Fetch delegations where the user is an admin
  const fetchDelegationsAsAdmin = async () => {
    if (!address || !isConnected || !publicClient) return;
    
    setIsLoading(true);
    
    try {
      // Get all delegates for this admin
      const delegateAddresses = await publicClient.readContract({
        address: DELEGATION_MANAGER_ADDRESS,
        abi: DELEGATION_MANAGER_ABI,
        functionName: 'getAdminDelegates',
        args: [address],
      });
      
      setDelegates(delegateAddresses);
      
      // For each delegate, get the delegation details
      const delegationDetails = await Promise.all(
        delegateAddresses.map(async (delegate) => {
          try {
            const delegation = await publicClient.readContract({
              address: DELEGATION_MANAGER_ADDRESS,
              abi: DELEGATION_MANAGER_ABI,
              functionName: 'getDelegation',
              args: [address, delegate],
            });
            
            const isActive = await publicClient.readContract({
              address: DELEGATION_MANAGER_ADDRESS,
              abi: DELEGATION_MANAGER_ABI,
              functionName: 'isDelegationActive',
              args: [address, delegate],
            });
            
            const remainingSpend = await publicClient.readContract({
              address: DELEGATION_MANAGER_ADDRESS,
              abi: DELEGATION_MANAGER_ABI,
              functionName: 'getRemainingSpendLimit',
              args: [address, delegate],
            });
            
            return {
              ...delegation,
              isActive,
              remainingSpend,
              delegateAddress: delegate,
            };
          } catch (error) {
            console.error(`Error fetching delegation details for ${delegate}:`, error);
            return null;
          }
        })
      );
      
      setDelegations(delegationDetails.filter(Boolean));
    } catch (error) {
      console.error('Error fetching delegations as admin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch delegations where the user is a delegate
  const fetchDelegationsAsDelegate = async () => {
    if (!address || !isConnected || !publicClient) return;
    
    setIsLoading(true);
    
    try {
      // Get all admins for this delegate
      const adminAddresses = await publicClient.readContract({
        address: DELEGATION_MANAGER_ADDRESS,
        abi: DELEGATION_MANAGER_ABI,
        functionName: 'getDelegateAdmins',
        args: [address],
      });
      
      setAdmins(adminAddresses);
      
      // For each admin, get the delegation details
      const delegationDetails = await Promise.all(
        adminAddresses.map(async (admin) => {
          try {
            const delegation = await publicClient.readContract({
              address: DELEGATION_MANAGER_ADDRESS,
              abi: DELEGATION_MANAGER_ABI,
              functionName: 'getDelegation',
              args: [admin, address],
            });
            
            const isActive = await publicClient.readContract({
              address: DELEGATION_MANAGER_ADDRESS,
              abi: DELEGATION_MANAGER_ABI,
              functionName: 'isDelegationActive',
              args: [admin, address],
            });
            
            const remainingSpend = await publicClient.readContract({
              address: DELEGATION_MANAGER_ADDRESS,
              abi: DELEGATION_MANAGER_ABI,
              functionName: 'getRemainingSpendLimit',
              args: [admin, address],
            });
            
            return {
              ...delegation,
              isActive,
              remainingSpend,
              adminAddress: admin,
            };
          } catch (error) {
            console.error(`Error fetching delegation details from ${admin}:`, error);
            return null;
          }
        })
      );
      
      // Combine with existing delegations
      setDelegations((prev) => [
        ...prev,
        ...delegationDetails.filter(Boolean),
      ]);
    } catch (error) {
      console.error('Error fetching delegations as delegate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle creating a new delegation
  const handleCreateDelegation = async (delegateAddress, spendLimit, expiryDuration) => {
    if (!isConnected) return;
    
    try {
      setIsLoading(true);
      const tx = await createDelegation({
        args: [
          delegateAddress,
          parseEther(spendLimit.toString()),
          expiryDuration, // in seconds
        ],
      });
      
      await tx.wait();
      await fetchDelegationsAsAdmin();
      return { success: true, hash: tx.hash };
    } catch (error) {
      console.error('Error creating delegation:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle updating a delegation
  const handleUpdateDelegation = async (delegateAddress, newSpendLimit, newExpiryDuration) => {
    if (!isConnected) return;
    
    try {
      setIsLoading(true);
      const tx = await updateDelegation({
        args: [
          delegateAddress,
          parseEther(newSpendLimit.toString()),
          newExpiryDuration, // in seconds
        ],
      });
      
      await tx.wait();
      await fetchDelegationsAsAdmin();
      return { success: true, hash: tx.hash };
    } catch (error) {
      console.error('Error updating delegation:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle revoking a delegation
  const handleRevokeDelegation = async (delegateAddress) => {
    if (!isConnected) return;
    
    try {
      setIsLoading(true);
      const tx = await revokeDelegation({
        args: [delegateAddress],
      });
      
      await tx.wait();
      await fetchDelegationsAsAdmin();
      return { success: true, hash: tx.hash };
    } catch (error) {
      console.error('Error revoking delegation:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch delegations on wallet connection or when component mounts
  useEffect(() => {
    if (isConnected && address) {
      // Clear previous delegations
      setDelegations([]);
      
      // Fetch delegations where user is admin and delegate
      fetchDelegationsAsAdmin();
      fetchDelegationsAsDelegate();
    }
  }, [isConnected, address]);

  return {
    delegations,
    delegates,
    admins,
    isLoading: isLoading || isCreating || isUpdating || isRevoking,
    createDelegation: handleCreateDelegation,
    updateDelegation: handleUpdateDelegation,
    revokeDelegation: handleRevokeDelegation,
    refreshDelegations: () => {
      setDelegations([]);
      fetchDelegationsAsAdmin();
      fetchDelegationsAsDelegate();
    },
  };
}