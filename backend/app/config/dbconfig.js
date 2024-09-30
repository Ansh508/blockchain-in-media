import mongoose from 'mongoose';

// Get the MongoDB URI from environment variables or use a default connection string
const uri = process.env.MONGODB_URI || "mongodb://username:password@localhost:27017/databaseName"; // Replace with your actual credentials

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};

// Exporting the connectDB function using ES module syntax
export default connectDB;
