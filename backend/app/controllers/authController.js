// controllers/accessControlController.js
import Web3 from 'web3';
import AccessControl from '../build/contracts/AccessControl.json' assert { type: "json" };
import { uploadFileToIPFS } from '../utils/ipfsUtils.js';

const web3 = new Web3('http://localhost:8545');

const accessControlAddress = '0x460Ef551F0e2820257eEC0A64915297B383f76fE'; 
const accessControlContract = new web3.eth.Contract(AccessControl.abi, accessControlAddress);

export const registerCreator = async (req, res) => {
    const { creatorAddress } = req.body;
    try {
        await accessControlContract.methods.addCreator(creatorAddress).send({ from: req.user.address });
        res.status(200).json({ message: "Creator registered successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Other functions remain unchanged

// Function to register a new verifier
export const registerVerifier = async (req, res) => {
    const { verifierAddress } = req.body;
    try {
        await accessControlContract.methods.addVerifier(verifierAddress).send({ from: req.user.address });
        res.status(200).json({ message: "Verifier registered successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to check if the user is an admin
export const isAdmin = async (req, res) => {
    try {
        const adminStatus = await accessControlContract.methods.isCreator(req.user.address).call();
        res.status(200).json({ isAdmin: adminStatus });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to log in a user (simplified for demo purposes)
export const loginUser = (req, res) => {
    // Implement your login logic (e.g., JWT or session management)
    res.status(200).json({ message: "User logged in." });
};
