// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// NFT badges for achievements and milestones (ERC-721)

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract NFTBadges is ERC721, ERC721URIStorage, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant METADATA_MANAGER_ROLE = keccak256("METADATA_MANAGER_ROLE");
    
    struct BadgeMetadata {
        string name;
        string description;
        string imageURI;
        uint8 rarity; // 1-5 (Common to Legendary)
        bool isActive;
    }
    
    mapping(uint256 => BadgeMetadata) private _badgeMetadata;
    mapping(address => mapping(uint256 => bool)) private _hasBadge;
    
    // Badge ID => Total minted
    mapping(uint256 => uint256) private _badgeMintCount;
    
    // Badge ID counter for creating new badge types
    uint256 private _badgeIdCounter;
    
    // Token ID counter for minting
    uint256 private _tokenIdCounter;
    
    constructor() ERC721("MetaFlux Badges", "MFB") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(METADATA_MANAGER_ROLE, msg.sender);
        
        // Initialize default badges
        _initializeDefaultBadges();
    }
    
    function _initializeDefaultBadges() private {
        _createBadgeInternal(
            "First Steps",
            "Awarded for recording your first expense",
            "ipfs://badge/first_steps.json",
            1
        );
        
        _createBadgeInternal(
            "Budget Master",
            "Awarded for creating your first budget",
            "ipfs://badge/budget_master.json",
            1
        );
        
        _createBadgeInternal(
            "Delegation Pro",
            "Awarded for creating your first delegation",
            "ipfs://badge/delegation_pro.json",
            2
        );
        
        _createBadgeInternal(
            "Expense Guru",
            "Awarded for recording 50 expenses",
            "ipfs://badge/expense_guru.json",
            3
        );
        
        _createBadgeInternal(
            "Category Expert",
            "Awarded for using all expense categories",
            "ipfs://badge/category_expert.json",
            3
        );
    }

    function _createBadgeInternal(
        string memory name,
        string memory description,
        string memory imageURI,
        uint8 rarity
    ) private returns (uint256) {
        require(rarity >= 1 && rarity <= 5, "NFTBadges: Rarity must be between 1 and 5");
        
        uint256 badgeId = _badgeIdCounter++;
        
        _badgeMetadata[badgeId] = BadgeMetadata({
            name: name,
            description: description,
            imageURI: imageURI,
            rarity: rarity,
            isActive: true
        });
        
        return badgeId;
    }
    
    function createBadge(
        string calldata name,
        string calldata description,
        string calldata imageURI,
        uint8 rarity
    ) external onlyRole(METADATA_MANAGER_ROLE) returns (uint256) {
        return _createBadgeInternal(name, description, imageURI, rarity);
    }
    
    function updateBadge(
        uint256 badgeId,
        string calldata name,
        string calldata description,
        string calldata imageURI,
        uint8 rarity
    ) external onlyRole(METADATA_MANAGER_ROLE) {
        require(_badgeMetadata[badgeId].isActive, "NFTBadges: Badge does not exist");
        require(rarity >= 1 && rarity <= 5, "NFTBadges: Rarity must be between 1 and 5");
        
        BadgeMetadata storage metadata = _badgeMetadata[badgeId];
        
        metadata.name = name;
        metadata.description = description;
        metadata.imageURI = imageURI;
        metadata.rarity = rarity;
    }
    
    function mintBadge(address to, uint256 badgeId) external onlyRole(MINTER_ROLE) returns (uint256) {
        require(_badgeMetadata[badgeId].isActive, "NFTBadges: Badge does not exist");
        
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        
        // Use badge ID in the URI to maintain the same metadata for the same badge type
        string memory uri = string(abi.encodePacked(
            "ipfs://badge/",
            _toString(badgeId),
            ".json"
        ));
        
        _setTokenURI(tokenId, uri);
        
        _hasBadge[to][badgeId] = true;
        _badgeMintCount[badgeId]++;
        
        return tokenId;
    }