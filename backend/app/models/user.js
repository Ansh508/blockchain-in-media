import mongoose from 'mongoose';

// Define the user schema
const userSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true // Ensure each address is unique
    },
    role: {
        type: String,
        enum: ['creator', 'verifier', 'admin'], // Define possible roles
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the date when the user is created
    },
    // Add any additional fields if necessary
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

// Export the model using ES module syntax
export default User;
