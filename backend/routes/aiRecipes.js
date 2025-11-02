import express from 'express';
import aiRecipeController from '../controllers/aiRecipeController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// AI recipe generation requires authentication
router.post('/generate', authenticateToken, aiRecipeController.generateRecipesFromIngredients.bind(aiRecipeController));

export default router;

