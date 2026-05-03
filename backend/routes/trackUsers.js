
import express from 'express';

import { createTracker } from '../controllers/tackerController.js';
const router = express.Router();

router.post('/register', createTracker)

export default router;