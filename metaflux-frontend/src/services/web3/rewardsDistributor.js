// src/services/web3/rewardsDistributor.js
import { useWeb3 } from './index';
import { useState, useCallback } from 'react';

// Helper to format user achievement data
const formatUserAchievement = (achievement) => {
  if (!achievement) return null;
  
  return {
    id: achievement.id,
    name: achievement.name,
    description: achievement.description,
    timestamp: new Date(achievement.timestamp * 1000),
    claimed: achievement.claimed
  };
};

// Helper to format achievement data
const formatAchievement = (achievement) => {
  if (!achievement || !achievement.isActive) return null;
  
  return {
    name: achievement.name,
    description: achievement.description,
    tokenReward: achievement.tokenReward,
    badgeId: achievement.badgeId,
    isActive: achievement.isActive
  };
};

export const useRewardsDistributor = () => {
  const { web3, accounts, contracts, loading } = useWeb3();
  const [txLoading, setTxLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user achievements
  const getUserAchievements = useCallback(async (userAddress = null) => {
    if (!contracts.rewardsDistributor) return [];
    
    try {
      const address = userAddress || accounts[0];
      if (!address) throw new Error('No user address provided');
      
      const achievements = await contracts.rewardsDistributor.methods
        .getUserAchievements(address)
        .call();
      
      return achievements.map(achievement => formatUserAchievement(achievement));
    } catch (err) {
      console.error('Error fetching user achievements:', err);
      setError(err.message || 'Failed to fetch user achievements');
      return [];
    }
  }, [accounts, contracts.rewardsDistributor]);

  // Get achievement by ID
  const getAchievement = useCallback(async (achievementId) => {
    if (!contracts.rewardsDistributor) return null;
    
    try {
      const achievement = await contracts.rewardsDistributor.methods
        .getAchievement(achievementId)
        .call();
      
      return formatAchievement(achievement);
    } catch (err) {
      console.error('Error fetching achievement:', err);
      setError(err.message || 'Failed to fetch achievement');
      return null;
    }
  }, [contracts.rewardsDistributor]);

  // Get next achievement milestones for user
  const getNextAchievementMilestones = useCallback(async (userAddress = null) => {
    if (!contracts.rewardsDistributor) return [];
    
    try {
      const address = userAddress || accounts[0];
      if (!address) throw new Error('No user address provided');
      
      const achievements = await contracts.rewardsDistributor.methods
        .getNextAchievementMilestones(address)
        .call();
      
      return achievements.map((achievement, index) => ({
        id: index, // This is not the actual achievement ID, just for display purposes
        ...formatAchievement(achievement)
      }));
    } catch (err) {
      console.error('Error fetching next achievement milestones:', err);
      setError(err.message || 'Failed to fetch next achievement milestones');
      return [];
    }
  }, [accounts, contracts.rewardsDistributor]);

  // Claim rewards for an achievement
  const claimRewards = useCallback(async (achievementId) => {
    if (!contracts.rewardsDistributor || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const receipt = await contracts.rewardsDistributor.methods
        .claimRewards(achievementId)
        .send({ from: accounts[0] });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error claiming rewards:', err);
      setError(err.message || 'Failed to claim rewards');
      setTxLoading(false);
      throw err;
    }
  }, [accounts, contracts.rewardsDistributor]);

  // For admin use only - Create new achievement
  const createAchievement = useCallback(async (name, description, tokenReward, badgeId) => {
    if (!contracts.rewardsDistributor || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const receipt = await contracts.rewardsDistributor.methods
        .createAchievement(name, description, tokenReward, badgeId)
        .send({ from: accounts[0] });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error creating achievement:', err);
      setError(err.message || 'Failed to create achievement. Make sure you have the required role.');
      setTxLoading(false);
      throw err;
    }
  }, [accounts, contracts.rewardsDistributor]);

  // For admin use only - Update existing achievement
  const updateAchievement = useCallback(async (achievementId, name, description, tokenReward, badgeId) => {
    if (!contracts.rewardsDistributor || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const receipt = await contracts.rewardsDistributor.methods
        .updateAchievement(achievementId, name, description, tokenReward, badgeId)
        .send({ from: accounts[0] });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error updating achievement:', err);
      setError(err.message || 'Failed to update achievement. Make sure you have the required role.');
      setTxLoading(false);
      throw err;
    }
  }, [accounts, contracts.rewardsDistributor]);

  // For admin use only - Award achievement to user
  const awardAchievement = useCallback(async (userAddress, achievementId) => {
    if (!contracts.rewardsDistributor || !accounts[0]) return;
    
    try {
      setTxLoading(true);
      setError(null);
      
      const receipt = await contracts.rewardsDistributor.methods
        .awardAchievement(userAddress, achievementId)
        .send({ from: accounts[0] });
      
      setTxLoading(false);
      return receipt;
    } catch (err) {
      console.error('Error awarding achievement:', err);
      setError(err.message || 'Failed to award achievement. Make sure you have the required role.');
      setTxLoading(false);
      throw err;
    }
  }, [accounts, contracts.rewardsDistributor]);

  // Get combined achievement data for user - both earned and available
  const getUserAchievementsWithDetails = useCallback(async (userAddress = null) => {
    if (!contracts.rewardsDistributor) return { earned: [], available: [] };
    
    try {
      const address = userAddress || accounts[0];
      if (!address) throw new Error('No user address provided');
      
      // Get user's earned achievements
      const userAchievements = await getUserAchievements(address);
      
      // Get next available achievements
      const nextAchievements = await getNextAchievementMilestones(address);
      
      // For each earned achievement, get the full details
      const earnedAchievementsPromises = userAchievements.map(async userAchievement => {
        const achievementDetails = await getAchievement(userAchievement.id);
        return {
          ...userAchievement,
          ...achievementDetails
        };
      });
      
      const earnedAchievements = await Promise.all(earnedAchievementsPromises);
      
      return {
        earned: earnedAchievements,
        available: nextAchievements
      };
    } catch (err) {
      console.error('Error fetching user achievements with details:', err);
      setError(err.message || 'Failed to fetch user achievements with details');
      return { earned: [], available: [] };
    }
  }, [
    accounts, 
    contracts.rewardsDistributor, 
    getUserAchievements, 
    getNextAchievementMilestones, 
    getAchievement
  ]);

  return {
    getUserAchievements,
    getAchievement,
    getNextAchievementMilestones,
    claimRewards,
    createAchievement,
    updateAchievement,
    awardAchievement,
    getUserAchievementsWithDetails,
    loading: loading || txLoading,
    error
  };
};