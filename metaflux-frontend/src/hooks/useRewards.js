import { useEffect, useState } from 'react';
import { useAccount, useContractRead, useContractWrite, usePublicClient } from 'wagmi';
import { 
  REWARDS_DISTRIBUTOR_ABI, 
  REWARDS_DISTRIBUTOR_ADDRESS,
  NFT_BADGES_ABI,
  NFT_BADGES_ADDRESS,
  METAFLUX_TOKEN_ABI,
  METAFLUX_TOKEN_ADDRESS
} from '../constants/contracts';

export function useRewards() {
  const { address, isConnected } = useAccount();
  const [achievements, setAchievements] = useState([]);
  const [nextAchievements, setNextAchievements] = useState([]);
  const [badges, setBadges] = useState([]);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const publicClient = usePublicClient();

  // Claim rewards function
  const { writeAsync: claimRewards, isPending: isClaiming } = useContractWrite({
    address: REWARDS_DISTRIBUTOR_ADDRESS,
    abi: REWARDS_DISTRIBUTOR_ABI,
    functionName: 'claimRewards',
  });

  // Read token balance
  const { data: balance, refetch: refetchBalance } = useContractRead({
    address: METAFLUX_TOKEN_ADDRESS,
    abi: METAFLUX_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address || '0x0000000000000000000000000000000000000000'],
    enabled: isConnected && !!address,
  });

  // Fetch user achievements from the contract
  const fetchUserAchievements = async () => {
    if (!address || !isConnected || !publicClient) return;
    
    setIsLoading(true);
    
    try {
      // Get all achievements for the user
      const userAchievements = await publicClient.readContract({
        address: REWARDS_DISTRIBUTOR_ADDRESS,
        abi: REWARDS_DISTRIBUTOR_ABI,
        functionName: 'getUserAchievements',
        args: [address],
      });
      
      // Get the next available achievements
      const nextMilestones = await publicClient.readContract({
        address: REWARDS_DISTRIBUTOR_ADDRESS,
        abi: REWARDS_DISTRIBUTOR_ABI,
        functionName: 'getNextAchievementMilestones',
        args: [address],
      });
      
      // Process the achievement data
      const processedAchievements = await Promise.all(
        userAchievements.map(async (achievement) => {
          try {
            // Get the achievement details
            const achievementDetails = await publicClient.readContract({
              address: REWARDS_DISTRIBUTOR_ADDRESS,
              abi: REWARDS_DISTRIBUTOR_ABI,
              functionName: 'getAchievement',
              args: [achievement.id],
            });
            
            // Get the badge details if the badge exists
            let badgeDetails = null;
            if (achievementDetails.badgeId !== undefined) {
              badgeDetails = await publicClient.readContract({
                address: NFT_BADGES_ADDRESS,
                abi: NFT_BADGES_ABI,
                functionName: 'getBadgeMetadata',
                args: [achievementDetails.badgeId],
              });
            }
            
            return {
              ...achievement,
              ...achievementDetails,
              badge: badgeDetails,
            };
          } catch (error) {
            console.error(`Error fetching details for achievement ${achievement.id}:`, error);
            return achievement;
          }
        })
      );
      
      const processedNextAchievements = await Promise.all(
        nextMilestones.map(async (milestone) => {
          try {
            // Get the badge details if the badge exists
            let badgeDetails = null;
            if (milestone.badgeId !== undefined) {
              badgeDetails = await publicClient.readContract({
                address: NFT_BADGES_ADDRESS,
                abi: NFT_BADGES_ABI,
                functionName: 'getBadgeMetadata',
                args: [milestone.badgeId],
              });
            }
            
            return {
              ...milestone,
              badge: badgeDetails,
            };
          } catch (error) {
            console.error(`Error fetching details for next achievement:`, error);
            return milestone;
          }
        })
      );
      
      setAchievements(processedAchievements);
      setNextAchievements(processedNextAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user badges from the NFT contract
  const fetchUserBadges = async () => {
    if (!address || !isConnected || !publicClient) return;
    
    try {
      // Get all token IDs owned by the user
      // Note: This is a simplified approach, assuming we know how to query owned NFTs
      // In a real-world application, you would need to track transfer events or use a more complex method
      
      // For each achievement that's claimed, check if the user has the badge
      const userBadges = await Promise.all(
        achievements
          .filter(a => a.claimed)
          .map(async (achievement) => {
            try {
              const hasBadge = await publicClient.readContract({
                address: NFT_BADGES_ADDRESS,
                abi: NFT_BADGES_ABI,
                functionName: 'hasBadge',
                args: [address, achievement.badgeId],
              });
              
              if (hasBadge) {
                const badgeMetadata = await publicClient.readContract({
                  address: NFT_BADGES_ADDRESS,
                  abi: NFT_BADGES_ABI,
                  functionName: 'getBadgeMetadata',
                  args: [achievement.badgeId],
                });
                
                return {
                  ...badgeMetadata,
                  id: achievement.badgeId,
                  achievementId: achievement.id,
                };
              }
              return null;
            } catch (error) {
              console.error(`Error checking badge for achievement ${achievement.id}:`, error);
              return null;
            }
          })
      );
      
      setBadges(userBadges.filter(Boolean));
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  // Handle claiming rewards
  const handleClaimRewards = async (achievementId) => {
    if (!isConnected) return;
    
    try {
      setIsLoading(true);
      const tx = await claimRewards({
        args: [achievementId],
      });
      
      await tx.wait();
      await fetchUserAchievements();
      await fetchUserBadges();
      await refetchBalance();
      return { success: true, hash: tx.hash };
    } catch (error) {
      console.error('Error claiming rewards:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Update token balance when it changes
  useEffect(() => {
    if (balance) {
      // Convert from wei to ether (or tokens with 18 decimals)
      setTokenBalance(parseFloat(balance.toString()) / 1e18);
    }
  }, [balance]);

  // Fetch achievements and badges on wallet connection or when component mounts
  useEffect(() => {
    if (isConnected && address) {
      fetchUserAchievements();
      fetchUserBadges();
      refetchBalance();
    }
  }, [isConnected, address]);

  return {
    achievements,
    nextAchievements,
    badges,
    tokenBalance,
    isLoading: isLoading || isClaiming,
    claimRewards: handleClaimRewards,
    refreshAchievements: fetchUserAchievements,
    refreshBadges: fetchUserBadges,
  };
}