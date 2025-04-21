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

contract RewardsDistributor is IRewardsDistributor, AccessControl, ReentrancyGuard {
    bytes32 public constant REWARD_MANAGER_ROLE = keccak256("REWARD_MANAGER_ROLE");
    bytes32 public constant ACHIEVEMENT_CREATOR_ROLE = keccak256("ACHIEVEMENT_CREATOR_ROLE");
    
    MetaFluxToken private _token;
    NFTBadges private _badges;
    
    // Achievement ID counter
    uint256 private _achievementIdTracker;
    
    // All achievements
    mapping(uint256 => Achievement) private _achievements;
    
    // User => UserAchievement ID => UserAchievement
    mapping(address => mapping(uint256 => UserAchievement)) private _userAchievements;
    
    // User => list of achievement IDs
    mapping(address => uint256[]) private _userAchievementIds;
    
    // User => Achievement ID => bool (has user earned this achievement)
    mapping(address => mapping(uint256 => bool)) private _hasEarnedAchievement;
    
    constructor(address tokenAddress, address badgesAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REWARD_MANAGER_ROLE, msg.sender);
        _grantRole(ACHIEVEMENT_CREATOR_ROLE, msg.sender);
        
        _token = MetaFluxToken(tokenAddress);
        _badges = NFTBadges(badgesAddress);
        
        // Initialize with default achievements
        _initializeDefaultAchievements();
    }
    
    function _initializeDefaultAchievements() private {
        // Basic achievements (IDs start from 0)
        _createAchievementInternal(
            "First Steps",
            "Record your first expense",
            50,
            0
        );
        
        _createAchievementInternal(
            "Budget Master",
            "Create your first budget",
            100,
            1
        );
        
        _createAchievementInternal(
            "Delegation Pro",
            "Create your first delegation",
            150,
            2
        );
        
        _createAchievementInternal(
            "Expense Guru",
            "Record 50 expenses",
            200,
            3
        );
        
        _createAchievementInternal(
            "Category Expert",
            "Use all expense categories",
            250,
            4
        );
    }