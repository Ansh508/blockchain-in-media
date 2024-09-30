import Web3 from 'web3';
import AccessControl from '../build/contracts/AccessControl.json' assert { type: "json" };

const web3 = new Web3('http://localhost:8545'); // Replace with your provider
const accessControlAddress = '0x460Ef551F0e2820257eEC0A64915297B383f76fE'; // Replace with deployed contract address
const accessControlContract = new web3.eth.Contract(AccessControl.abi, accessControlAddress);

export const addAdmin = async (ownerAddress, adminAddress) => {
    try {
        await accessControlContract.methods.addAdmin(adminAddress).send({ from: ownerAddress });
        console.log('Admin added successfully');
    } catch (error) {
        throw new Error(`Failed to add admin: ${error.message}`);
    }
};

export const removeAdmin = async (ownerAddress, adminAddress) => {
    try {
        await accessControlContract.methods.removeAdmin(adminAddress).send({ from: ownerAddress });
        console.log('Admin removed successfully');
    } catch (error) {
        throw new Error(`Failed to remove admin: ${error.message}`);
    }
};

export const isCreator = async (address) => {
    try {
        return await accessControlContract.methods.isCreator(address).call();
    } catch (error) {
        throw new Error(`Failed to check creator status: ${error.message}`);
    }
};

export const isVerifier = async (address) => {
    try {
        return await accessControlContract.methods.isVerifier(address).call();
    } catch (error) {
        throw new Error(`Failed to check verifier status: ${error.message}`);
    }
};
