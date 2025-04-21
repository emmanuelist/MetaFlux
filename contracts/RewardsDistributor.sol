// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Tracks and distributes rewards based on spending behavior

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./MetaFluxToken.sol";
import "./NFTBadges.sol";

interface IRewardsDistributor {
    struct UserAchievement {
        uint256 id;
        string name;
        string description;
        uint256 timestamp;
        bool claimed;
    }
    
    struct Achievement {
        string name;
        string description;
        uint256 tokenReward;
        uint256 badgeId;
        bool isActive;
    }
    
    event AchievementEarned(
        address indexed user,
        uint256 achievementId,
        string name
    );
    
    event RewardClaimed(
        address indexed user,
        uint256 achievementId,
        uint256 tokenAmount,
        uint256 badgeId
    );
    
    event AchievementCreated(
        uint256 achievementId,
        string name,
        uint256 tokenReward,
        uint256 badgeId
    );
    
    event AchievementUpdated(
        uint256 achievementId,
        string name,
        uint256 tokenReward,
        uint256 badgeId
    );
    
    function createAchievement(string calldata name, string calldata description, uint256 tokenReward, uint256 badgeId) external;
    function updateAchievement(uint256 achievementId, string calldata name, string calldata description, uint256 tokenReward, uint256 badgeId) external;
    function awardAchievement(address user, uint256 achievementId) external;
    function claimRewards(uint256 achievementId) external;
    function getUserAchievements(address user) external view returns (UserAchievement[] memory);
    function getAchievement(uint256 achievementId) external view returns (Achievement memory);
    function getNextAchievementMilestones(address user) external view returns (Achievement[] memory);
}

