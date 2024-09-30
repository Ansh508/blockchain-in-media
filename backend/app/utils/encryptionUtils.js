// utils/encryptionUtils.js
import crypto from 'crypto';

// Replace with your own secure secret key
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // Replace with a fixed key or environment variable
const iv = crypto.randomBytes(16); // Initialization vector

/**
 * Encrypt data using AES-256-CBC
 * @param {string} data - The data to encrypt
 * @param {Buffer} secretKey - The key for encryption
 * @returns {string} The encrypted data in hexadecimal format
 */
export const encrypt = (data, secretKey = key) => {
    let cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`; // Return IV and encrypted data
};

/**
 * Decrypt data using AES-256-CBC
 * @param {string} encryptedData - The encrypted data
 * @param {Buffer} secretKey - The key for decryption
 * @returns {string} The decrypted data
 */
export const decrypt = (encryptedData, secretKey = key) => {
    const [ivHex, content] = encryptedData.split(':');
    const ivBuffer = Buffer.from(ivHex, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, secretKey, ivBuffer);
    let decrypted = decipher.update(content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted; // Return the decrypted data
};

/**
 * Generate a secure encryption key
 * @returns {Buffer} The generated key
 */
export const generateKey = () => {
    return crypto.randomBytes(32); // Return a random 256-bit key
};
