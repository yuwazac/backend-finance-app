import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';
import { uploadProfilePicture } from '../controllers/uploadControl.js';
import {  getProfilePicture } from '../controllers/profileController.js';
const profileRouter = express.Router();



profileRouter.post('/profile', authMiddleware, upload.single('image'), uploadProfilePicture);


profileRouter.post('/upload', authMiddleware, upload.single('image'), uploadProfilePicture);


profileRouter.get('/profile', authMiddleware, getProfilePicture);

export default profileRouter;