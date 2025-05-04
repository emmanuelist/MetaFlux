// src/services/web3/nftBadges.js
import { useWeb3 } from './index';
import { useState, useCallback } from 'react';

// Helper to format badge metadata
const formatBadgeMetadata = (metadata) => {
  if (!metadata || !metadata.isActive) return null;
  
  return {
    name: metadata.name,
    description: metadata.description,
    imageURI: metadata.imageURI,
    rarity: parseInt(metadata.rarity),
    isActive: metadata.isActive
  };
};

export const useNFTBadges = () => {
  const { web3, accounts, contracts, loading } = useWeb3();
  const [txLoading, setTxLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get badge metadata by ID
  const getBadgeMetadata = useCallback(async (badgeId) => {
    if (!contracts.nftBadges) return null;
    
    try {
      const metadata = await contracts.nftBadges.methods
        .getBadgeMetadata(badgeId)
        .call();
      
      return formatBadgeMetadata(metadata);
    } catch (err) {
      console.error('Error fetching badge metadata:', err);
      setError(err.message || 'Failed to fetch badge metadata');
      return null;
    }
  }, [contracts.nftBadges]);

  // Check if user has a specific badge
  const hasBadge = useCallback(async (badgeId, userAddress = null) => {
    if (!contracts.nftBadges) return false;
    
    try {
      const address = userAddress || accounts[0];
      if (!address) throw new Error('No user address provided');
      
      return await contracts.nftBadges.methods
        .hasBadge(address, badgeId)
        .call();
    } catch (err) {
      console.error('Error checking if user has badge:', err);
      setError(err.message || 'Failed to check if user has badge');
      return false;
    }
  }, [accounts, contracts.nftBadges]);

  // Get badge mint count
  const getBadgeMintCount = useCallback(async (badgeId) => {
    if (!contracts.nftBadges) return 0;
    
    try {
      return await contracts.nftBadges.methods
        .getBadgeMintCount(badgeId)
        .call();
    } catch (err) {
      console.error('Error fetching badge mint count:', err);
      setError(err.message || 'Failed to fetch badge mint count');
      return 0;
    }
  }, [contracts.nftBadges]);

  // Check if badge exists
  const badgeExists = useCallback(async (badgeId) => {
    if (!contracts.nftBadges) return false;
    
    try {
      return await contracts.nftBadges.methods
        .exists(badgeId)
        .call();
    } catch (err) {
      console.error('Error checking if badge exists:', err);
      setError(err.message || 'Failed to check if badge exists');
      return false;
    }
  }, [contracts.nftBadges]);

  // For admin use only - Create new badge
  const createBadge = useCallback(async (name, description, imageURI, rarity) => {
    if (!contracts.nftBadges || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const receipt = await contracts.nftBadges.methods
        .createBadge(name, description, imageURI, rarity)
        .send({ from: accounts[0] });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error creating badge:', err);
      setError(err.message || 'Failed to create badge. Make sure you have the required role.');
      setTxLoading(false);
      throw err;
    }
  }, [accounts, contracts.nftBadges]);

  // For admin use only - Update existing badge
  const updateBadge = useCallback(async (badgeId, name, description, imageURI, rarity) => {
    if (!contracts.nftBadges || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const receipt = await contracts.nftBadges.methods
        .updateBadge(badgeId, name, description, imageURI, rarity)
        .send({ from: accounts[0] });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error updating badge:', err);
      setError(err.message || 'Failed to update badge. Make sure you have the required role.');
      setTxLoading(false);
      throw err;
    }
  }, [accounts, contracts.nftBadges]);

  // For admin use only - Mint badge
  const mintBadge = useCallback(async (toAddress, badgeId) => {
    if (!contracts.nftBadges || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const receipt = await contracts.nftBadges.methods
        .mintBadge(toAddress, badgeId)
        .send({ from: accounts[0] });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error minting badge:', err);
      setError(err.message || 'Failed to mint badge. Make sure you have the required role.');
      setTxLoading(false);
      throw err;
    }
  }, [accounts, contracts.nftBadges]);

  // Get all badges metadata
  const getAllBadgesMetadata = useCallback(async () => {
    if (!contracts.nftBadges) return [];
    
    try {
      // Since we don't have a direct method to get all badges,
      // we'll need to iterate through badge IDs until we find an invalid one
      const badges = [];
      let badgeId = 0;
      let exists = true;
      
      while (exists) {
        try {
          const metadata = await getBadgeMetadata(badgeId);
          if (metadata) {
            badges.push({
              id: badgeId,
              ...metadata
            });
          }
          badgeId++;
        } catch (error) {
          exists = false;
        }
      }
      
      return badges;
    } catch (err) {
      console.error('Error fetching all badges metadata:', err);
      setError(err.message || 'Failed to fetch all badges metadata');
      return [];
    }
  }, [contracts.nftBadges, getBadgeMetadata]);

  // Get all badges owned by user
  const getUserBadges = useCallback(async (userAddress = null) => {
    if (!contracts.nftBadges) return [];
    
    try {
      const address = userAddress || accounts[0];
      if (!address) throw new Error('No user address provided');
      
      // Get all available badges first
      const allBadges = await getAllBadgesMetadata();
      
      // Check which badges the user has
      const userBadgesPromises = allBadges.map(async badge => {
        const hasThisBadge = await hasBadge(badge.id, address);
        return hasThisBadge ? badge : null;
      });
      
      const userBadges = await Promise.all(userBadgesPromises);
      
      // Filter out null entries
      return userBadges.filter(badge => badge !== null);
    } catch (err) {
      console.error('Error fetching user badges:', err);
      setError(err.message || 'Failed to fetch user badges');
      return [];
    }
  }, [accounts, contracts.nftBadges, getAllBadgesMetadata, hasBadge]);

  return {
    getBadgeMetadata,
    hasBadge,
    getBadgeMintCount,
    badgeExists,
    createBadge,
    updateBadge,
    mintBadge,
    getAllBadgesMetadata,
    getUserBadges,
    loading: loading || txLoading,
    error
  };
};