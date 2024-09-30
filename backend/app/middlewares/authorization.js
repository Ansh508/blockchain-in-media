import { isCreator, isVerifier } from '../services/blockchainService.js'; // Import the function from your service

// Middleware to check if the user is a creator or verifier
export const authorize = (requiredRole) => {
    return async (req, res, next) => {
        const userAddress = req.user.address; // Assuming user's address is stored in req.user

        try {
            let hasAccess = false;

            // Check the required role and validate access accordingly
            if (requiredRole === 'creator') {
                hasAccess = await isCreator(userAddress);
            } else if (requiredRole === 'verifier') {
                hasAccess = await isVerifier(userAddress);
            }

            // Deny access if the user does not have the required role
            if (!hasAccess) {
                return res.status(403).json({ message: `Access denied. User does not have ${requiredRole} permissions.` });
            }

            next(); // Proceed to the next middleware if access is granted
        } catch (error) {
            res.status(500).json({ message: `Error checking permissions: ${error.message}` });
        }
    };
};

