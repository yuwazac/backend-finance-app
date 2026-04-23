import express from 'express';

import { createTrackController } from '../controllers/tackerController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createTrackController);
router.get('/', authMiddleware, createTrackController);
router.get('/:id', authMiddleware, createTrackController);

export default router;
