// src/services/web3/metaFluxToken.js
import { useWeb3 } from './index';
import { useState, useCallback } from 'react';

export const useMetaFluxToken = () => {
  const { web3, accounts, contracts, loading } = useWeb3();
  const [txLoading, setTxLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get token balance
  const getBalance = useCallback(async (address = null) => {
    if (!contracts.metaFluxToken) return '0';
    
    try {
      const ownerAddress = address || accounts[0];
      if (!ownerAddress) throw new Error('No address provided');
      
      const balance = await contracts.metaFluxToken.methods
        .balanceOf(ownerAddress)
        .call();
      
      return web3.utils.fromWei(balance, 'ether');
    } catch (err) {
      console.error('Error fetching token balance:', err);
      setError(err.message || 'Failed to fetch token balance');
      return '0';
    }
  }, [web3, accounts, contracts.metaFluxToken]);

  // Transfer tokens
  const transfer = useCallback(async (recipientAddress, amount) => {
    if (!contracts.metaFluxToken || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
      
      const receipt = await contracts.metaFluxToken.methods
        .transfer(recipientAddress, amountInWei)
        .send({ from: accounts[0] });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error transferring tokens:', err);
      setError(err.message || 'Failed to transfer tokens');
      setTxLoading(false);
      throw err;
    }
  }, [web3, accounts, contracts.metaFluxToken]);

  // Approve spending
  const approve = useCallback(async (spenderAddress, amount) => {
    if (!contracts.metaFluxToken || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
      
      const receipt = await contracts.metaFluxToken.methods
        .approve(spenderAddress, amountInWei)
        .send({ from: accounts[0] });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error approving token spending:', err);
      setError(err.message || 'Failed to approve token spending');
      setTxLoading(false);
      throw err;
    }
  }, [web3, accounts, contracts.metaFluxToken]);

  // Get allowance
  const getAllowance = useCallback(async (ownerAddress, spenderAddress) => {
    if (!contracts.metaFluxToken) return '0';
    
    try {
      const allowance = await contracts.metaFluxToken.methods
        .allowance(ownerAddress, spenderAddress)
        .call();
      
      return web3.utils.fromWei(allowance, 'ether');
    } catch (err) {
      console.error('Error fetching token allowance:', err);
      setError(err.message || 'Failed to fetch token allowance');
      return '0';
    }
  }, [web3, contracts.metaFluxToken]);

  // Burn tokens
  const burn = useCallback(async (amount) => {
    if (!contracts.metaFluxToken || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
      
      const receipt = await contracts.metaFluxToken.methods
        .burn(amountInWei)
        .send({ from: accounts[0] });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error burning tokens:', err);
      setError(err.message || 'Failed to burn tokens');
      setTxLoading(false);
      throw err;
    }
  }, [web3, accounts, contracts.metaFluxToken]);

  // Admin only - Mint tokens
  const mint = useCallback(async (recipientAddress, amount) => {
    if (!contracts.metaFluxToken || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
      
      const receipt = await contracts.metaFluxToken.methods
        .mint(recipientAddress, amountInWei)
        .send({ from: accounts[0] });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error minting tokens:', err);
      setError(err.message || 'Failed to mint tokens. Make sure you have the required role.');
      setTxLoading(false);
      throw err;
    }
  }, [web3, accounts, contracts.metaFluxToken]);

  // Get token info
  const getTokenInfo = useCallback(async () => {
    if (!contracts.metaFluxToken) return null;
    
    try {
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contracts.metaFluxToken.methods.name().call(),
        contracts.metaFluxToken.methods.symbol().call(),
        contracts.metaFluxToken.methods.decimals().call(),
        contracts.metaFluxToken.methods.totalSupply().call()
      ]);
      
      return {
        name,
        symbol,
        decimals,
        totalSupply: web3.utils.fromWei(totalSupply, 'ether')
      };
    } catch (err) {
      console.error('Error fetching token info:', err);
      setError(err.message || 'Failed to fetch token info');
      return null;
    }
  }, [web3, contracts.metaFluxToken]);

  return {
    getBalance,
    transfer,
    approve,
    getAllowance,
    burn,
    mint,
    getTokenInfo,
    loading: loading || txLoading,
    error
  };
};