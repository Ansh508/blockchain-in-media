// utils/ipfsUtils.js
import { create } from 'ipfs-http-client';

// Initialize IPFS client (adjust the URL based on your IPFS provider)
const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });

/**
 * Upload a file to IPFS
 * @param {File} file - The file to upload
 * @returns {Promise<string>} The IPFS hash of the uploaded file
 */
export const uploadFileToIPFS = async (file) => {
    try {
        const result = await ipfs.add(file);
        return result.path; // Return the IPFS hash
    } catch (error) {
        throw new Error(`Failed to upload file to IPFS: ${error.message}`);
    }
};

/**
 * Retrieve a file from IPFS
 * @param {string} ipfsHash - The IPFS hash of the file
 * @returns {Promise<Buffer>} The file retrieved from IPFS
 */
export const retrieveFileFromIPFS = async (ipfsHash) => {
    try {
        const chunks = [];
        for await (const chunk of ipfs.cat(ipfsHash)) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks); // Return the file content as a Buffer
    } catch (error) {
        throw new Error(`Failed to retrieve file from IPFS: ${error.message}`);
    }
};

/**
 * Check if a file exists on IPFS
 * @param {string} ipfsHash - The IPFS hash of the file
 * @returns {Promise<boolean>} True if the file exists, otherwise false
 */
export const checkFileExists = async (ipfsHash) => {
    try {
        const file = await ipfs.cat(ipfsHash);
        return !!file; // Return true if the file exists
    } catch {
        return false; // Return false if the file does not exist
    }
};
