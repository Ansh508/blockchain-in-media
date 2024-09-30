import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
    const mongoURI = process.env.MONGODB_URI || "mongodb://admin:Ansh%40508@localhost:27017/myNewDatabase"; // Default URI if env variable is not set

    try {
        // Connect to MongoDB without deprecated options
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1); // Exit process with failure
    }
};

// Exporting the connectDB function using ES module syntax
export default connectDB;
