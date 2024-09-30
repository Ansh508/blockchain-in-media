import mongoose from 'mongoose';

// Define the transaction schema
const transactionSchema = new mongoose.Schema({
    transactionId: {
        type: Number,
        required: true,
        unique: true // Ensure each transaction has a unique ID
    },
    payer: {
        type: String,
        required: true // Address of the payer
    },
    creator: {
        type: String,
        required: true // Address of the content creator
    },
    amount: {
        type: Number,
        required: true // Amount paid in wei
    },
    contentId: {
        type: Number,
        required: true // ID of the associated content
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the date when the transaction is created
    },
});

// Create a model based on the schema
const Transaction = mongoose.model('Transaction', transactionSchema);

// Export the model using ES module syntax
export default Transaction;
