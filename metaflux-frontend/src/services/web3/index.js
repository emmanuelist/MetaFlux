// src/services/web3/index.js
import { useState } from 'react';
import { useAccount, useNetwork, usePublicClient, useWalletClient } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { useWalletContext } from '../../components/providers/wallet-provider';

// Import contract ABIs - these will need to be generated from your Solidity contracts
// Replace these imports with the actual paths to your contract ABIs
import BudgetManagerABI from '../../../contracts/artifacts/BudgetManager.json'; 
import DelegationManagerABI from '../../../contracts/artifacts/DelegationManager.json';
import ExpenseTrackerABI from '../../../contracts/artifacts/ExpenseTracker.json';
import NFTBadgesABI from '../../../contracts/artifacts/NFTBadges.json';
import RewardsDistributorABI from '../../../contracts/artifacts/RewardsDistributor.json';
import MetaFluxTokenABI from '../../../contracts/artifacts/MetaFluxToken.json';

// Contract addresses - replace with your deployed contract addresses
export const CONTRACT_ADDRESSES = {
  // Mainnet addresses
  1: {
    budgetManager: '0x...',
    delegationManager: '0x...',
    expenseTracker: '0x...',
    nftBadges: '0x...',
    rewardsDistributor: '0x...',
    metaFluxToken: '0x...'
  },
  // Sepolia addresses
  11155111: {
    budgetManager: '0x...',
    delegationManager: '0x...',
    expenseTracker: '0x...',
    nftBadges: '0x...',
    rewardsDistributor: '0x...',
    metaFluxToken: '0x...'
  },
  // Linea Mainnet addresses
  59144: {
    budgetManager: '0x...',
    delegationManager: '0x...',
    expenseTracker: '0x...',
    nftBadges: '0x...',
    rewardsDistributor: '0x...',
    metaFluxToken: '0x...'
  },
  // Linea Testnet (Sepolia) addresses
  59140: {
    budgetManager: '0x...',
    delegationManager: '0x...',
    expenseTracker: '0x...',
    nftBadges: '0x...',
    rewardsDistributor: '0x...',
    metaFluxToken: '0x...'
  }
};

// Contract ABIs mapping
export const CONTRACT_ABIS = {
  budgetManager: BudgetManagerABI.abi,
  delegationManager: DelegationManagerABI.abi,
  expenseTracker: ExpenseTrackerABI.abi,
  nftBadges: NFTBadgesABI.abi,
  rewardsDistributor: RewardsDistributorABI.abi,
  metaFluxToken: MetaFluxTokenABI.abi
};

// Hook for working with contracts
export function useContract(contractName) {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { setIsConnecting } = useWalletContext();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get the contract address for the current chain
  const getContractAddress = () => {
    if (!chain?.id) return null;
    
    // Default to mainnet if chain is not supported
    const chainAddresses = CONTRACT_ADDRESSES[chain.id] || CONTRACT_ADDRESSES[1];
    return chainAddresses[contractName];
  };

  // Read data from the contract (view functions)
  const read = async (functionName, args = []) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const contractAddress = getContractAddress();
      if (!contractAddress) {
        throw new Error(`Contract address not found for ${contractName} on chain ${chain?.id}`);
      }
      
      const result = await publicClient.readContract({
        address: contractAddress,
        abi: CONTRACT_ABIS[contractName],
        functionName,
        args
      });
      
      setIsLoading(false);
      return result;
    } catch (err) {
      console.error(`Error reading from ${contractName}.${functionName}:`, err);
      setError(err.message || `Error reading from ${contractName}.${functionName}`);
      setIsLoading(false);
      throw err;
    }
  };

  // Write data to the contract (transaction functions)
  const write = async (functionName, args = [], options = {}) => {
    try {
      if (!walletClient || !address) {
        throw new Error('Wallet not connected');
      }
      
      setIsLoading(true);
      setError(null);
      setIsConnecting(true); // Let the UI know we're processing a transaction
      
      const contractAddress = getContractAddress();
      if (!contractAddress) {
        throw new Error(`Contract address not found for ${contractName} on chain ${chain?.id}`);
      }
      
      // Prepare the transaction
      const { request } = await publicClient.simulateContract({
        account: address,
        address: contractAddress,
        abi: CONTRACT_ABIS[contractName],
        functionName,
        args,
        value: options.value ? parseEther(options.value) : undefined
      });
      
      // Send the transaction
      const hash = await walletClient.writeContract(request);
      
      // Wait for the transaction to be mined
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      setIsLoading(false);
      setIsConnecting(false);
      return receipt;
    } catch (err) {
      console.error(`Error writing to ${contractName}.${functionName}:`, err);
      setError(err.message || `Error writing to ${contractName}.${functionName}`);
      setIsLoading(false);
      setIsConnecting(false);
      throw err;
    }
  };

  return {
    read,
    write,
    isLoading,
    error,
    isConnected,
    contractAddress: getContractAddress()
  };
}

// Utility to format an Ethereum address for display
export function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Helper function to convert from Wei to Ether
export function fromWei(value) {
  if (!value) return '0';
  return formatEther(value);
}

// Helper function to convert from Ether to Wei
export function toWei(value) {
  if (!value) return '0';
  return parseEther(value.toString());
}