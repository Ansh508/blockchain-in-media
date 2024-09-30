// Example route file: paymentRoutes.js
import express from 'express';
import { payContentCreator } from '../controllers/paymentController.js'; 
import { authenticate } from '../middlewares/authentication.js'; // Update the import to use 'authenticate'
import { errorHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

// Define a POST route for making payments - requires authentication
router.post('/pay', authenticate, payContentCreator, errorHandler);

export default router;
