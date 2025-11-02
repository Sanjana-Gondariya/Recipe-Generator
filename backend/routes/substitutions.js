import express from 'express';
import substitutionController from '../controllers/substitutionController.js';

const router = express.Router();

router.post('/', substitutionController.getSubstitution.bind(substitutionController));

export default router;
