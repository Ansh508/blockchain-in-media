import express from 'express';
import { uploadContent, verifyContent, deactivateContent, getContent } from '../controllers/contentController.js'; 
import { authenticate } from '../middlewares/authentication.js'; // Import authentication middleware
import { authorize } from '../middlewares/authorization.js'; // Import authorization middleware
import { errorHandler } from '../middlewares/errorHandler.js'; // Import error handler middleware

const router = express.Router();

// Route to upload content - requires authentication and authorization as a creator
router.post('/upload', authenticate, authorize('creator'), uploadContent, errorHandler);

// Route to verify content - requires authentication and authorization as a verifier
router.post('/verify', authenticate, authorize('verifier'), verifyContent, errorHandler);

// Route to deactivate content - requires authentication and authorization as the content creator
router.post('/deactivate', authenticate, authorize('creator'), deactivateContent, errorHandler);

// Route to get content details by content ID
router.get('/:contentId', getContent, errorHandler);

export default router;
