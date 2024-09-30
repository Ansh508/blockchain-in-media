// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AccessControl.sol"; // Role-based access for content creators
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // Use ERC-20 for payment tokens
import "@openzeppelin/contracts/utils/Counters.sol"; // Track content IDs

contract Content is AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _contentIds;

    IERC20 public paymentToken; // ERC-20 token for compensation
    uint256 public platformFee; // Fee percentage taken by platform
    address public platformWallet; // Platform wallet for fees

    struct ContentData {
        uint256 id;
        address creator;
        string ipfsHash; // IPFS hash for storing the content metadata (title, description, etc.)
        uint256 price; // Price of the content in tokens
        uint256 timestamp; // Creation time for IP verification
        bool isActive;
    }

    // Mapping from content ID to content data
    mapping(uint256 => ContentData) public contents;
    // Mapping from creator to list of their content IDs
    mapping(address => uint256[]) public creatorContents;

    // Events
    event ContentCreated(uint256 contentId, address indexed creator, string ipfsHash, uint256 price);
    event ContentPurchased(uint256 contentId, address indexed buyer, address indexed creator, uint256 amount);
    event ContentDeactivated(uint256 contentId);

    constructor(IERC20 _paymentToken, uint256 _platformFee, address _platformWallet) {
        paymentToken = _paymentToken;
        platformFee = _platformFee;
        platformWallet = _platformWallet;
    }

    // Modifier to check if the caller is the creator of the content
    modifier onlyCreator(uint256 contentId) {
        require(contents[contentId].creator == msg.sender, "Only the content creator can perform this action");
        _;
    }

    // Modifier to check if the content is active
    modifier isActiveContent(uint256 contentId) {
        require(contents[contentId].isActive, "This content is not active");
        _;
    }

    // Create new content and store its metadata on IPFS
    function createContent(string memory _ipfsHash, uint256 _price) external {
        require(_price > 0, "Price must be greater than 0");

        _contentIds.increment();
        uint256 newContentId = _contentIds.current();

        contents[newContentId] = ContentData({
            id: newContentId,
            creator: msg.sender,
            ipfsHash: _ipfsHash,
            price: _price,
            timestamp: block.timestamp,
            isActive: true
        });

        creatorContents[msg.sender].push(newContentId);
        emit ContentCreated(newContentId, msg.sender, _ipfsHash, _price);
    }

    // Purchase content and compensate the creator
    function purchaseContent(uint256 contentId) external isActiveContent(contentId) {
        ContentData memory content = contents[contentId];
        uint256 totalPrice = content.price;

        // Calculate platform fee
        uint256 feeAmount = (totalPrice * platformFee) / 100;
        uint256 creatorAmount = totalPrice - feeAmount;

        // Transfer tokens
        require(paymentToken.transferFrom(msg.sender, platformWallet, feeAmount), "Platform fee transfer failed");
        require(paymentToken.transferFrom(msg.sender, content.creator, creatorAmount), "Creator payment transfer failed");

        emit ContentPurchased(contentId, msg.sender, content.creator, totalPrice);
    }

    // Deactivate content
    function deactivateContent(uint256 contentId) external onlyCreator(contentId) isActiveContent(contentId) {
        contents[contentId].isActive = false;
        emit ContentDeactivated(contentId);
    }

    // Function to verify content ownership and timestamp
    function verifyContent(uint256 contentId) external view returns (address creator, uint256 timestamp, string memory ipfsHash) {
        ContentData memory content = contents[contentId];
        return (content.creator, content.timestamp, content.ipfsHash);
    }

    // Platform fee management
    function updatePlatformFee(uint256 newFee) external onlyAdmin {
        platformFee = newFee;
    }

    function updatePlatformWallet(address newWallet) external onlyAdmin {
        platformWallet = newWallet;
    }
}

