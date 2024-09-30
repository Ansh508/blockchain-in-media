// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Payment is AccessControl {
    IERC20 public paymentToken; // The ERC-20 token used for payments
    uint256 public platformFee; // Platform fee percentage
    address public platformWallet; // Platform wallet for collecting fees

    // Events
    event PaymentProcessed(
        address indexed buyer,
        address indexed creator,
        uint256 amount,
        uint256 feeAmount
    );
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    event PlatformWalletUpdated(address oldWallet, address newWallet);

    constructor(
        IERC20 _paymentToken,
        uint256 _platformFee,
        address _platformWallet
    ) AccessControl() { // Explicitly calling the AccessControl constructor
        paymentToken = _paymentToken;
        platformFee = _platformFee;
        platformWallet = _platformWallet;
    }

    // Modifier to ensure a valid fee percentage
    modifier validFee(uint256 _fee) {
        require(_fee >= 0 && _fee <= 100, "Invalid fee percentage");
        _;
    }

    // Function to process a payment between a buyer and a content creator
    function processPayment(address buyer, address creator, uint256 amount) external {
        require(amount > 0, "Payment amount must be greater than zero");

        // Calculate the platform fee and the amount to be sent to the creator
        uint256 feeAmount = (amount * platformFee) / 100;
        uint256 creatorAmount = amount - feeAmount;

        // Transfer the platform fee to the platform wallet
        require(
            paymentToken.transferFrom(buyer, platformWallet, feeAmount),
            "Platform fee transfer failed"
        );

        // Transfer the remaining amount to the creator
        require(
            paymentToken.transferFrom(buyer, creator, creatorAmount),
            "Creator payment transfer failed"
        );

        emit PaymentProcessed(buyer, creator, amount, feeAmount);
    }

    // Function to update the platform fee (only owner or admin can do this)
    function updatePlatformFee(uint256 newFee) external onlyAdmin validFee(newFee) {
        uint256 oldFee = platformFee;
        platformFee = newFee;
        emit PlatformFeeUpdated(oldFee, newFee);
    }

    // Function to update the platform wallet address (only owner or admin can do this)
    function updatePlatformWallet(address newWallet) external onlyAdmin {
        require(newWallet != address(0), "New wallet address cannot be zero address");
        address oldWallet = platformWallet;
        platformWallet = newWallet;
        emit PlatformWalletUpdated(oldWallet, newWallet);
    }

    // Withdraw any tokens mistakenly sent to the contract
    function withdrawTokens(IERC20 token, address to, uint256 amount) external onlyOwner {
        require(token.balanceOf(address(this)) >= amount, "Insufficient token balance");
        token.transfer(to, amount);
    }
}
