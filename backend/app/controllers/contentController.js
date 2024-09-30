// controllers/contentController.js
import Web3 from 'web3';
import Content from '../build/contracts/Content.json' assert { type: "json" };
import { uploadFileToIPFS } from '../utils/ipfsUtils.js';

const web3 = new Web3('http://localhost:8545');
const contentAddress = '0xc7C306d63b9c272509988d2A355b8935D375eCCe'; 
const contentContract = new web3.eth.Contract(Content.abi, contentAddress);

// Function to upload content
export const uploadContent = async (req, res) => {
    const { file, price } = req.body; // Assuming file is included in the request body
    const creatorAddress = req.user.address;
    try {
        const ipfsHash = await uploadFileToIPFS(file); // Upload file to IPFS
        await contentContract.methods.uploadContent(ipfsHash, web3.utils.toWei(price.toString(), 'ether')).send({ from: creatorAddress });
        res.status(200).json({ message: "Content uploaded successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Other functions remain unchanged


// Function to verify content
export const verifyContent = async (req, res) => {
    const { contentId } = req.body;
    const verifierAddress = req.user.address; // Assuming user address is set in request
    try {
        await contentContract.methods.verifyContent(contentId).send({ from: verifierAddress });
        res.status(200).json({ message: "Content verified successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to deactivate content
export const deactivateContent = async (req, res) => {
    const { contentId } = req.body;
    const creatorAddress = req.user.address; // Assuming user address is set in request
    try {
        await contentContract.methods.deactivateContent(contentId).send({ from: creatorAddress });
        res.status(200).json({ message: "Content deactivated successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to get content details
export const getContent = async (req, res) => {
    const { contentId } = req.params;
    try {
        const contentDetails = await contentContract.methods.getContent(contentId).call();
        res.status(200).json({
            creator: contentDetails[0],
            ipfsHash: contentDetails[1],
            price: web3.utils.fromWei(contentDetails[2], 'ether'),
            isVerified: contentDetails[3],
            isActive: contentDetails[4]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
