import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';
import pkg from 'multer-storage-cloudinary';

const { CloudinaryStorage } = pkg;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'images',
  allowedFormats: ['jpg', 'jpeg', 'png'],
});

const upload = multer({ storage });

export default upload;