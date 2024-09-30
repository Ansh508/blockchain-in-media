require('@babel/register');
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const { expect } = chai;

const AccessControl = artifacts.require("AccessControl");
const Content = artifacts.require("Content");
const ERC20Mock = artifacts.require("ERC20Mock");

contract("Content", (accounts) => {
    let content;
    let paymentToken;
    const [owner, admin, creator, user] = accounts;

    beforeEach(async () => {
        // Deploy the mock ERC20 token
        paymentToken = await ERC20Mock.new("TestToken", "TT", { from: owner });
        await paymentToken.mint(user, web3.utils.toWei("1000", "ether"), { from: owner });

        // Deploy AccessControl and add admin
        const accessControl = await AccessControl.new();
        await accessControl.addAdmin(admin, { from: owner });

        // Deploy Content contract
        content = await Content.new(paymentToken.address, 5, owner);
    });

    describe("Content Creation", () => {
        it("should allow the creator to create content", async () => {
            const ipfsHash = "Qm..."; // Replace with a valid IPFS hash
            const price = web3.utils.toWei("100", "ether");

            // Create content
            await content.createContent(ipfsHash, price, { from: creator });

            // Check the created content
            const contentData = await content.contents(1);
            expect(contentData.creator).to.equal(creator);
            expect(contentData.ipfsHash).to.equal(ipfsHash);
            expect(contentData.price.toString()).to.equal(price);
            expect(contentData.isActive).to.be.true;
        });

        it("should not allow content creation with zero price", async () => {
            const ipfsHash = "Qm..."; // Replace with a valid IPFS hash

            // Attempt to create content with zero price
            await expect(content.createContent(ipfsHash, 0, { from: creator }))
                .to.be.rejectedWith("Price must be greater than 0");
        });
    });

    describe("Content Purchase", () => {
        it("should allow users to purchase content", async () => {
            const ipfsHash = "Qm...";
            const price = web3.utils.toWei("100", "ether");
            await content.createContent(ipfsHash, price, { from: creator });

            // Approve payment for purchase
            await paymentToken.approve(content.address, price, { from: user });

            // Get balances before purchase
            const userBalanceBefore = await paymentToken.balanceOf(user);
            const creatorBalanceBefore = await paymentToken.balanceOf(creator);
            const platformBalanceBefore = await paymentToken.balanceOf(owner);

            // Purchase content
            await content.purchaseContent(1, { from: user });

            // Get balances after purchase
            const userBalanceAfter = await paymentToken.balanceOf(user);
            const creatorBalanceAfter = await paymentToken.balanceOf(creator);
            const platformBalanceAfter = await paymentToken.balanceOf(owner);

            // Check balances
            expect(userBalanceAfter.toString()).to.equal(userBalanceBefore.sub(web3.utils.toBN(price)).toString());
            expect(creatorBalanceAfter.toString()).to.equal(creatorBalanceBefore.add(web3.utils.toBN(price).mul(web3.utils.toBN(95)).div(web3.utils.toBN(100))).toString()); // 95% to creator
            expect(platformBalanceAfter.toString()).to.equal(platformBalanceBefore.add(web3.utils.toBN(price).mul(web3.utils.toBN(5)).div(web3.utils.toBN(100))).toString()); // 5% to platform
        });

        it("should not allow purchase of inactive content", async () => {
            const ipfsHash = "Qm...";
            const price = web3.utils.toWei("100", "ether");
            await content.createContent(ipfsHash, price, { from: creator });
            await content.deactivateContent(1, { from: creator });

            // Attempt to purchase inactive content
            await expect(content.purchaseContent(1, { from: user })).to.be.rejectedWith("This content is not active");
        });
    });

    describe("Content Deactivation", () => {
        it("should allow the creator to deactivate their content", async () => {
            const ipfsHash = "Qm...";
            const price = web3.utils.toWei("100", "ether");
            await content.createContent(ipfsHash, price, { from: creator });

            // Deactivate content
            await content.deactivateContent(1, { from: creator });
            const contentData = await content.contents(1);
            expect(contentData.isActive).to.be.false;
        });

        it("should not allow non-creators to deactivate content", async () => {
            const ipfsHash = "Qm...";
            const price = web3.utils.toWei("100", "ether");
            await content.createContent(ipfsHash, price, { from: creator });

            // Attempt to deactivate content as a non-creator
            await expect(content.deactivateContent(1, { from: user })).to.be.rejectedWith("Only the content creator can perform this action");
        });
    });

    describe("Content Verification", () => {
        it("should allow verification of content ownership and timestamp", async () => {
            const ipfsHash = "Qm..."; // Replace with a valid IPFS hash
            const price = web3.utils.toWei("100", "ether");
            await content.createContent(ipfsHash, price, { from: creator });
    
            const [verifiedCreator, timestamp, verifiedIpfsHash] = await content.verifyContent(1);
            expect(verifiedCreator).to.equal(creator);
            expect(verifiedIpfsHash).to.equal(ipfsHash);
        });
    });
    
    describe("Platform Fee Management", () => {
        it("should allow the admin to update the platform fee", async () => {
            await content.updatePlatformFee(10, { from: admin });
            const newFee = await content.platformFee();
            expect(newFee.toString()).to.equal("10");
        });
    
        it("should allow the admin to update the platform wallet", async () => {
            const newWallet = accounts[2];
            await content.updatePlatformWallet(newWallet, { from: admin });
            const updatedWallet = await content.platformWallet();
            expect(updatedWallet).to.equal(newWallet);
        });
    
        it("should not allow non-admin to update the platform fee", async () => {
            await expect(content.updatePlatformFee(10, { from: creator })).to.be.rejected;
        });
    
        it("should not allow non-admin to update the platform wallet", async () => {
            const newWallet = accounts[2];
            await expect(content.updatePlatformWallet(newWallet, { from: creator })).to.be.rejected;
        });
    });
    


});
