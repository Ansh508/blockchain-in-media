// blockchainConfig.js

const blockchainConfig = {
    web3Provider: process.env.WEB3_PROVIDER || 'http://localhost:8545', // Default provider URL
    accessControlAddress: process.env.ACCESS_CONTROL_ADDRESS || '0x460Ef551F0e2820257eEC0A64915297B383f76fE',
    paymentAddress: process.env.PAYMENT_ADDRESS || '0x93F6426Ecf69dA9370070C9E57211def52402259',
    contentAddress: process.env.CONTENT_ADDRESS || '0xc7C306d63b9c272509988d2A355b8935D375eCCe',
    // Add other blockchain-related configurations here
};

export default blockchainConfig;
