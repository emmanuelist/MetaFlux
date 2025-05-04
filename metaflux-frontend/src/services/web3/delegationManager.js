// src/services/web3/delegationManager.js
import { useWeb3 } from './index';
import { useState, useCallback } from 'react';

// Helper to format delegation data
const formatDelegation = (delegation, web3) => {
  if (!delegation || !delegation.isActive) return null;
  
  return {
    admin: delegation.admin,
    delegate: delegation.delegate,
    spendLimit: web3.utils.fromWei(delegation.spendLimit, 'ether'),
    spentAmount: web3.utils.fromWei(delegation.spentAmount, 'ether'),
    expiryTime: new Date(delegation.expiryTime * 1000),
    isActive: delegation.isActive,
    remaining: web3.utils.fromWei(
      (BigInt(delegation.spendLimit) - BigInt(delegation.spentAmount)).toString(), 
      'ether'
    ),
    percentage: delegation.spendLimit === '0' 
      ? 0 
      : (BigInt(delegation.spentAmount) * BigInt(100) / BigInt(delegation.spendLimit)).toString(),
    isExpired: parseInt(delegation.expiryTime) < Math.floor(Date.now() / 1000)
  };
};

export const useDelegationManager = () => {
  const { web3, accounts, contracts, loading } = useWeb3();
  const [txLoading, setTxLoading] = useState(false);
  const [error, setError] = useState(null);

  const createDelegation = useCallback(async (delegateAddress, spendLimit, expiryDuration) => {
    if (!contracts.delegationManager || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const spendLimitInWei = web3.utils.toWei(spendLimit.toString(), 'ether');
      
      // Convert duration to seconds
      const durationInSeconds = expiryDuration * 24 * 60 * 60; // days to seconds
      
      const receipt = await contracts.delegationManager.methods
        .createDelegation(delegateAddress, spendLimitInWei, durationInSeconds)
        .send({ from: accounts[0] });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error creating delegation:', err);
      setError(err.message || 'Failed to create delegation');
      setTxLoading(false);
      throw err;
    }
  }, [web3, accounts, contracts.delegationManager]);

  const updateDelegation = useCallback(async (delegateAddress, newSpendLimit, newExpiryDuration) => {
    if (!contracts.delegationManager || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const newSpendLimitInWei = web3.utils.toWei(newSpendLimit.toString(), 'ether');
      
      // Convert duration to seconds
      const durationInSeconds = newExpiryDuration * 24 * 60 * 60; // days to seconds
      
      const receipt = await contracts.delegationManager.methods
        .updateDelegation(delegateAddress, newSpendLimitInWei, durationInSeconds)
        .send({ from: accounts[0] });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error updating delegation:', err);
      setError(err.message || 'Failed to update delegation');
      setTxLoading(false);
      throw err;
    }
  }, [web3, accounts, contracts.delegationManager]);

  const revokeDelegation = useCallback(async (delegateAddress) => {
    if (!contracts.delegationManager || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const receipt = await contracts.delegationManager.methods
        .revokeDelegation(delegateAddress)
        .send({ from: accounts[0] });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error revoking delegation:', err);
      setError(err.message || 'Failed to revoke delegation');
      setTxLoading(false);
      throw err;
    }
  }, [accounts, contracts.delegationManager]);

  const recordDelegatedSpend = useCallback(async (adminAddress, delegateAddress, amount) => {
    // Note: This function should only be called by authorized contracts
    if (!contracts.delegationManager || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
      
      const receipt = await contracts.delegationManager.methods
        .recordDelegatedSpend(adminAddress, delegateAddress, amountInWei)
        .send({ from: accounts[0] });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error recording delegated spend:', err);
      setError(err.message || 'Failed to record delegated spend. Make sure you have the required role.');
      setTxLoading(false);
      throw err;
    }
  }, [web3, accounts, contracts.delegationManager]);

  const getDelegation = useCallback(async (adminAddress, delegateAddress) => {
    if (!contracts.delegationManager) return null;
    
    try {
      const delegation = await contracts.delegationManager.methods
        .getDelegation(adminAddress, delegateAddress)
        .call();
      
      return formatDelegation(delegation, web3);
    } catch (err) {
      console.error('Error fetching delegation:', err);
      setError(err.message || 'Failed to fetch delegation');
      return null;
    }
  }, [web3, contracts.delegationManager]);

  const isDelegationActive = useCallback(async (adminAddress, delegateAddress) => {
    if (!contracts.delegationManager) return false;
    
    try {
      return await contracts.delegationManager.methods
        .isDelegationActive(adminAddress, delegateAddress)
        .call();
    } catch (err) {
      console.error('Error checking if delegation is active:', err);
      setError(err.message || 'Failed to check if delegation is active');
      return false;
    }
  }, [contracts.delegationManager]);

  const getRemainingSpendLimit = useCallback(async (adminAddress, delegateAddress) => {
    if (!contracts.delegationManager) return '0';
    
    try {
      const remaining = await contracts.delegationManager.methods
        .getRemainingSpendLimit(adminAddress, delegateAddress)
        .call();
      
      return web3.utils.fromWei(remaining, 'ether');
    } catch (err) {
      console.error('Error fetching remaining spend limit:', err);
      setError(err.message || 'Failed to fetch remaining spend limit');
      return '0';
    }
  }, [web3, contracts.delegationManager]);

  const getAdminDelegates = useCallback(async (adminAddress = null) => {
    if (!contracts.delegationManager) return [];
    
    try {
      const admin = adminAddress || accounts[0];
      if (!admin) throw new Error('No admin address provided');
      
      const delegates = await contracts.delegationManager.methods
        .getAdminDelegates(admin)
        .call();
      
      return delegates;
    } catch (err) {
      console.error('Error fetching admin delegates:', err);
      setError(err.message || 'Failed to fetch admin delegates');
      return [];
    }
  }, [accounts, contracts.delegationManager]);

  const getDelegateAdmins = useCallback(async (delegateAddress = null) => {
    if (!contracts.delegationManager) return [];
    
    try {
      const delegate = delegateAddress || accounts[0];
      if (!delegate) throw new Error('No delegate address provided');
      
      const admins = await contracts.delegationManager.methods
        .getDelegateAdmins(delegate)
        .call();
      
      return admins;
    } catch (err) {
      console.error('Error fetching delegate admins:', err);
      setError(err.message || 'Failed to fetch delegate admins');
      return [];
    }
  }, [accounts, contracts.delegationManager]);

  // Get all delegations for an admin
  const getAllAdminDelegations = useCallback(async (adminAddress = null) => {
    if (!contracts.delegationManager) return [];
    
    try {
      const admin = adminAddress || accounts[0];
      if (!admin) throw new Error('No admin address provided');
      
      // Get all delegates for this admin
      const delegates = await getAdminDelegates(admin);
      
      // Fetch delegation details for each delegate
      const delegationPromises = delegates.map(delegateAddress => 
        getDelegation(admin, delegateAddress)
      );
      
      const delegations = await Promise.all(delegationPromises);
      
      // Filter out null delegations
      return delegations.filter(delegation => delegation !== null);
    } catch (err) {
      console.error('Error fetching all admin delegations:', err);
      setError(err.message || 'Failed to fetch all admin delegations');
      return [];
    }
  }, [accounts, contracts.delegationManager, getAdminDelegates, getDelegation]);

  // Get all delegations where user is a delegate
  const getAllDelegateDelegations = useCallback(async (delegateAddress = null) => {
    if (!contracts.delegationManager) return [];
    
    try {
      const delegate = delegateAddress || accounts[0];
      if (!delegate) throw new Error('No delegate address provided');
      
      // Get all admins for this delegate
      const admins = await getDelegateAdmins(delegate);
      
      // Fetch delegation details for each admin
      const delegationPromises = admins.map(adminAddress => 
        getDelegation(adminAddress, delegate)
      );
      
      const delegations = await Promise.all(delegationPromises);
      
      // Filter out null delegations
      return delegations.filter(delegation => delegation !== null);
    } catch (err) {
      console.error('Error fetching all delegate delegations:', err);
      setError(err.message || 'Failed to fetch all delegate delegations');
      return [];
    }
  }, [accounts, contracts.delegationManager, getDelegateAdmins, getDelegation]);

  return {
    createDelegation,
    updateDelegation,
    revokeDelegation,
    recordDelegatedSpend,
    getDelegation,
    isDelegationActive,
    getRemainingSpendLimit,
    getAdminDelegates,
    getDelegateAdmins,
    getAllAdminDelegations,
    getAllDelegateDelegations,
    loading: loading || txLoading,
    error
  };
};