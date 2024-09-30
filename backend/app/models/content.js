import mongoose from 'mongoose';

// Define the content schema
const contentSchema = new mongoose.Schema({
    contentId: {
        type: Number,
        required: true,
        unique: true // Ensure each content item has a unique ID
    },
    creator: {
        type: String,
        required: true // Address of the creator
    },
    ipfsHash: {
        type: String,
        required: true // IPFS hash of the content
    },
    price: {
        type: Number,
        required: true // Price of the content in wei
    },
    isVerified: {
        type: Boolean,
        default: false // Content verification status
    },
    isActive: {
        type: Boolean,
        default: true // Active status of the content
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the date when the content is created
    },
});

// Create a model based on the schema
const Content = mongoose.model('Content', contentSchema);

// Export the model
export default Content;
