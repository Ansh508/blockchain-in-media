import Web3 from 'web3';
import Content from '../build/contracts/Content.json' assert { type: "json" };

const web3 = new Web3('http://localhost:8545'); // Replace with your provider
const contentContractAddress = '0xc7C306d63b9c272509988d2A355b8935D375eCCe'; // Replace with deployed contract address
const contentContract = new web3.eth.Contract(Content.abi, contentContractAddress);

export const uploadContent = async (creatorAddress, ipfsHash, price) => {
    try {
        await contentContract.methods.uploadContent(ipfsHash, price).send({ from: creatorAddress });
        console.log('Content uploaded successfully');
    } catch (error) {
        throw new Error(`Failed to upload content: ${error.message}`);
    }
};

export const verifyContent = async (verifierAddress, contentId) => {
    try {
        await contentContract.methods.verifyContent(contentId).send({ from: verifierAddress });
        console.log('Content verified successfully');
    } catch (error) {
        throw new Error(`Failed to verify content: ${error.message}`);
    }
};

export const deactivateContent = async (creatorAddress, contentId) => {
    try {
        await contentContract.methods.deactivateContent(contentId).send({ from: creatorAddress });
        console.log('Content deactivated successfully');
    } catch (error) {
        throw new Error(`Failed to deactivate content: ${error.message}`);
    }
};

export const getContent = async (contentId) => {
    try {
        const content = await contentContract.methods.getContent(contentId).call();
        return {
            creator: content[0],
            ipfsHash: content[1],
            price: content[2],
            isVerified: content[3],
            isActive: content[4],
        };
    } catch (error) {
        throw new Error(`Failed to get content: ${error.message}`);
    }
};
