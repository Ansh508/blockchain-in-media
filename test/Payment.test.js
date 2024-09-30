const { expect } = require("chai");
const Payment = artifacts.require("Payment");
const AccessControl = artifacts.require("AccessControl");
const ERC20 = artifacts.require("ERC20"); // Assuming you have an ERC20 token contract for testing

contract("Payment", (accounts) => {
    let payment;
    let paymentToken;
    const [owner, admin, creator, user] = accounts;

    beforeEach(async () => {
        // Deploy an ERC20 token for payment
        paymentToken = await ERC20.new("TestToken", "TT", 1000000, { from: owner });

        // Deploy the AccessControl contract
        const accessControl = await AccessControl.new();
        await accessControl.addAdmin(admin, { from: owner });

        // Deploy the Payment contract
        payment = await Payment.new(paymentToken.address, 5, owner); // 5% platform fee

        // Mint some tokens to the user for testing
        await paymentToken.transfer(user, 1000, { from: owner });
    });

    describe("Payment Processing", () => {
        it("should allow users to process a payment", async () => {
            const amount = 100;
            await paymentToken.approve(payment.address, amount, { from: user });

            const userBalanceBefore = await paymentToken.balanceOf(user);
            const creatorBalanceBefore = await paymentToken.balanceOf(creator);
            const platformBalanceBefore = await paymentToken.balanceOf(owner);

            await payment.processPayment(user, creator, amount, { from: admin });

            const userBalanceAfter = await paymentToken.balanceOf(user);
            const creatorBalanceAfter = await paymentToken.balanceOf(creator);
            const platformBalanceAfter = await paymentToken.balanceOf(owner);

            expect(userBalanceAfter.toString()).to.equal(userBalanceBefore.sub(amount).toString());
            expect(creatorBalanceAfter.toString()).to.equal(creatorBalanceBefore.add(amount * 0.95).toString()); // 95% to creator
            expect(platformBalanceAfter.toString()).to.equal(platformBalanceBefore.add(amount * 0.05).toString()); // 5% to platform
        });

        it("should revert if the payment amount is zero", async () => {
            await expect(payment.processPayment(user, creator, 0, { from: admin })).to.be.revertedWith("Payment amount must be greater than zero");
        });

        it("should revert if the buyer has insufficient allowance", async () => {
            const amount = 100;
            await expect(payment.processPayment(user, creator, amount, { from: admin })).to.be.revertedWith("Platform fee transfer failed");
        });
    });

    describe("Platform Fee Management", () => {
        it("should allow the admin to update the platform fee", async () => {
            await payment.updatePlatformFee(10, { from: admin });
            const newFee = await payment.platformFee();
            expect(newFee.toString()).to.equal("10");
        });

        it("should emit an event when the platform fee is updated", async () => {
            const oldFee = await payment.platformFee();
            const tx = await payment.updatePlatformFee(10, { from: admin });
            const newFee = await payment.platformFee();

            expect(tx.logs[0].event).to.equal("PlatformFeeUpdated");
            expect(tx.logs[0].args.oldFee.toString()).to.equal(oldFee.toString());
            expect(tx.logs[0].args.newFee.toString()).to.equal("10");
        });

        it("should not allow non-admin to update the platform fee", async () => {
            await expect(payment.updatePlatformFee(10, { from: creator })).to.be.revertedWith("Only the admin can perform this action");
        });

        it("should not allow invalid platform fee updates", async () => {
            await expect(payment.updatePlatformFee(101, { from: admin })).to.be.revertedWith("Invalid fee percentage");
        });
    });

    describe("Platform Wallet Management", () => {
        it("should allow the admin to update the platform wallet", async () => {
            const newWallet = accounts[2];
            await payment.updatePlatformWallet(newWallet, { from: admin });
            const updatedWallet = await payment.platformWallet();
            expect(updatedWallet).to.equal(newWallet);
        });

        it("should emit an event when the platform wallet is updated", async () => {
            const oldWallet = await payment.platformWallet();
            const newWallet = accounts[2];
            const tx = await payment.updatePlatformWallet(newWallet, { from: admin });

            expect(tx.logs[0].event).to.equal("PlatformWalletUpdated");
            expect(tx.logs[0].args.oldWallet).to.equal(oldWallet);
            expect(tx.logs[0].args.newWallet).to.equal(newWallet);
        });

        it("should not allow non-admin to update the platform wallet", async () => {
            await expect(payment.updatePlatformWallet(accounts[2], { from: creator })).to.be.revertedWith("Only the admin can perform this action");
        });

        it("should not allow setting the platform wallet to the zero address", async () => {
            await expect(payment.updatePlatformWallet("0x0000000000000000000000000000000000000000", { from: admin })).to.be.revertedWith("New wallet address cannot be zero address");
        });
    });

    describe("Withdraw Tokens", () => {
        it("should allow the owner to withdraw mistakenly sent tokens", async () => {
            await paymentToken.transfer(payment.address, 100, { from: owner });
            const balanceBefore = await paymentToken.balanceOf(owner);
            await payment.withdrawTokens(paymentToken.address, owner, 50, { from: owner });

            const balanceAfter = await paymentToken.balanceOf(owner);
            expect(balanceAfter.toString()).to.equal(balanceBefore.add(50).toString());
        });

        it("should revert if trying to withdraw more than the contract balance", async () => {
            await paymentToken.transfer(payment.address, 100, { from: owner });
            await expect(payment.withdrawTokens(paymentToken.address, owner, 200, { from: owner })).to.be.revertedWith("Insufficient token balance");
        });

        it("should not allow non-owner to withdraw tokens", async () => {
            await expect(payment.withdrawTokens(paymentToken.address, owner, 50, { from: admin })).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });
});
