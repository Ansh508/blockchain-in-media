// authentication.js
import jwt from 'jsonwebtoken';

// Middleware to authenticate user
export const authenticate = (req, res, next) => {
    // Extract token from Authorization header (Bearer token format)
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

    if (!token) {
        // If no token is provided, return 401 (Unauthorized)
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token using the secret stored in environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
        req.user = decoded; // Attach user info to request
        next(); // Proceed to the next middleware
    } catch (error) {
        // If token verification fails, return 400 (Bad Request)
        res.status(400).json({ message: 'Invalid token.' });
    }
};
