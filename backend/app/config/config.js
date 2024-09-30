// config.js

import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const config = {
    server: {
        port: process.env.PORT || 5000, // Default port if not specified
    },
    database: {
        uri: process.env.DB_URI || 'mongodb://admin:Ansh%40508@localhost:27017/myNewDatabase', // MongoDB URI
    },
    jwtSecret: process.env.JWT_SECRET || 'f4b4cff8008d35c4755d751582afda68fd2ab971b4c0c236bc58c51c8b13400e', // JWT secret for token generation
    // Add other general configurations here
};

export default config;
