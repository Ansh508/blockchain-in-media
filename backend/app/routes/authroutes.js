import express from 'express';
import {
    registerCreator,
    registerVerifier,
    isAdmin,
    loginUser
} from '../controllers/authController.js';
import { errorHandler } from '../middlewares/errorHandler.js'; // Import error handler middleware

const router = express.Router();

// Route to register a new creator
router.post('/register/creator', registerCreator, errorHandler);

// Route to register a new verifier
router.post('/register/verifier', registerVerifier, errorHandler);

// Route to check if the user is an admin
router.get('/isAdmin', isAdmin, errorHandler);

// Route for user login
router.post('/login', loginUser, errorHandler);

export default router;
