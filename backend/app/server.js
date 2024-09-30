// Import necessary modules
import express from 'express';
import connectDB from './config/db.js'; // Import the connectDB function
import dotenv from 'dotenv';
import authRoutes from './routes/authroutes.js'; // Import authentication routes
import config from './config/config.js'; // Import general configurations

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = config.server.port; // Use the port from config

// Middleware
app.use(express.json());

// Get the MongoDB URI from the config
const mongoURI = config.database.uri; // Use the URI from config

// Check if the MongoDB URI is defined
if (!mongoURI) {
    console.error('MongoDB URI is not defined.');
    process.exit(1); // Exit if the URI is not set
}

// Connect to MongoDB using the connectDB function
connectDB(mongoURI);

// Use the authentication routes
app.use('/api/auth', authRoutes);

// Sample route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
