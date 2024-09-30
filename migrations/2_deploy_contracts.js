const AccessControl = artifacts.require("AccessControl");
const Content = artifacts.require("Content");
const Payment = artifacts.require("Payment");
const MyERC20Token = artifacts.require("MyERC20Token");

module.exports = async function (deployer, network, accounts) {
  // Define the platform settings
  const platformFee = 5; // Set the platform fee percentage (e.g., 5%)
  const platformWallet = accounts[0]; // Set the platform wallet to the first account in the list
  
  // Deploy the ERC-20 Token (MyERC20Token)
  const initialSupply = web3.utils.toWei("1000", "ether"); // 1000 tokens
  await deployer.deploy(MyERC20Token, initialSupply);
  const token = await MyERC20Token.deployed();
  
  console.log(`ERC-20 Token deployed at address: ${token.address}`);
  
  // Deploy AccessControl
  await deployer.deploy(AccessControl);
  const accessControl = await AccessControl.deployed();
  
  console.log(`AccessControl deployed at address: ${accessControl.address}`);
  
  // Use the address of the deployed token
  const paymentTokenAddress = token.address; 
  console.log(`Payment Token Address: ${paymentTokenAddress}`);

  // Check if the address is a valid Ethereum address
  if (!web3.utils.isAddress(paymentTokenAddress)) {
      console.error(`Invalid payment token address: ${paymentTokenAddress}`);
      throw new Error("Invalid payment token address");
  }

  // Deploy the Content contract with the deployed token's address and platform settings
  await deployer.deploy(Content, paymentTokenAddress, platformFee, platformWallet);
  const content = await Content.deployed();
  
  console.log(`Content Contract deployed at address: ${content.address}`);
  
  // Deploy the Payment contract with the deployed token's address and platform settings
  await deployer.deploy(Payment, paymentTokenAddress, platformFee, platformWallet);
  const payment = await Payment.deployed();
  
  console.log(`Payment Contract deployed at address: ${payment.address}`);
  
  // Optionally, you can initialize some logic post-deployment, like setting admins, etc.
  // Example: Add an admin
  await accessControl.addAdmin(accounts[1], { from: accounts[0] }); // accounts[1] becomes an admin
  
  console.log("Contracts deployed:");
  console.log("AccessControl Address:", accessControl.address);
  console.log("Content Contract Address:", content.address);
  console.log("Payment Contract Address:", payment.address);
};
