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

    function _createAchievementInternal(
        string memory name,
        string memory description,
        uint256 tokenReward,
        uint256 badgeId
    ) private returns (uint256) {
        uint256 achievementId = _achievementIdTracker++;
        
        _achievements[achievementId] = Achievement({
            name: name,
            description: description,
            tokenReward: tokenReward,
            badgeId: badgeId,
            isActive: true
        });
        
        emit AchievementCreated(achievementId, name, tokenReward, badgeId);
        
        return achievementId;
    }
    
    function createAchievement(
        string calldata name,
        string calldata description,
        uint256 tokenReward,
        uint256 badgeId
    ) external override onlyRole(ACHIEVEMENT_CREATOR_ROLE) {
        require(bytes(name).length > 0, "RewardsDistributor: Name cannot be empty");
        require(_badges.exists(badgeId), "RewardsDistributor: Badge does not exist");
        
        _createAchievementInternal(name, description, tokenReward, badgeId);
    }
    
    function updateAchievement(
        uint256 achievementId,
        string calldata name,
        string calldata description,
        uint256 tokenReward,
        uint256 badgeId
    ) external override onlyRole(ACHIEVEMENT_CREATOR_ROLE) {
        require(_achievements[achievementId].isActive, "RewardsDistributor: Achievement does not exist");
        require(bytes(name).length > 0, "RewardsDistributor: Name cannot be empty");
        require(_badges.exists(badgeId), "RewardsDistributor: Badge does not exist");
        
        Achievement storage achievement = _achievements[achievementId];
        
        achievement.name = name;
        achievement.description = description;
        achievement.tokenReward = tokenReward;
        achievement.badgeId = badgeId;
        
        emit AchievementUpdated(achievementId, name, tokenReward, badgeId);
    }
    
    function awardAchievement(
        address user,
        uint256 achievementId
    ) external override onlyRole(REWARD_MANAGER_ROLE) {
        require(user != address(0), "RewardsDistributor: Invalid user address");
        require(_achievements[achievementId].isActive, "RewardsDistributor: Achievement does not exist");
        require(!_hasEarnedAchievement[user][achievementId], "RewardsDistributor: Achievement already earned");
        
        Achievement storage achievement = _achievements[achievementId];
        
        _userAchievements[user][achievementId] = UserAchievement({
            id: achievementId,
            name: achievement.name,
            description: achievement.description,
            timestamp: block.timestamp,
            claimed: false
        });
        
        _userAchievementIds[user].push(achievementId);
        _hasEarnedAchievement[user][achievementId] = true;
        
        emit AchievementEarned(user, achievementId, achievement.name);
    }

    function claimRewards(uint256 achievementId) external override nonReentrant {
        require(_hasEarnedAchievement[msg.sender][achievementId], "RewardsDistributor: Achievement not earned");
        
        UserAchievement storage userAchievement = _userAchievements[msg.sender][achievementId];
        Achievement storage achievement = _achievements[achievementId];
        
        require(!userAchievement.claimed, "RewardsDistributor: Rewards already claimed");
        
        userAchievement.claimed = true;
        
        // Mint tokens
        _token.mint(msg.sender, achievement.tokenReward);
        
        // Mint NFT badge
        _badges.mintBadge(msg.sender, achievement.badgeId);
        
        emit RewardClaimed(
            msg.sender,
            achievementId,
            achievement.tokenReward,
            achievement.badgeId
        );
    }
    
    function getUserAchievements(address user) external view override returns (UserAchievement[] memory) {
        uint256[] storage achievementIds = _userAchievementIds[user];
        UserAchievement[] memory userAchievements = new UserAchievement[](achievementIds.length);
        
        for (uint256 i = 0; i < achievementIds.length; i++) {
            userAchievements[i] = _userAchievements[user][achievementIds[i]];
        }
        
        return userAchievements;
    }

    function getAchievement(uint256 achievementId) external view override returns (Achievement memory) {
        require(_achievements[achievementId].isActive, "RewardsDistributor: Achievement does not exist");
        return _achievements[achievementId];
    }
    
    function getNextAchievementMilestones(address user) external view override returns (Achievement[] memory) {
        // This is a simplified implementation that returns up to 5 achievements the user hasn't earned yet
        uint256 count = 0;
        uint256 maxResults = 5;
        
        // First, count how many unearned achievements we have (up to maxResults)
        for (uint256 i = 0; i < _achievementIdTracker && count < maxResults; i++) {
            if (_achievements[i].isActive && !_hasEarnedAchievement[user][i]) {
                count++;
            }
        }
        
        Achievement[] memory nextAchievements = new Achievement[](count);
        
        // Now fill the array
        uint256 index = 0;
        for (uint256 i = 0; i < _achievementIdTracker && index < count; i++) {
            if (_achievements[i].isActive && !_hasEarnedAchievement[user][i]) {
                nextAchievements[index] = _achievements[i];
                index++;
            }
        }
        
        return nextAchievements;
    }
}