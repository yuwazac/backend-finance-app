import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';
import pkg from 'multer-storage-cloudinary';

const { CloudinaryStorage } = pkg;

// Temporary: use disk storage for testing
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   folder: 'images',
//   allowedFormats: ['jpg', 'jpeg', 'png'],
//   transformation: [{ width: 500, height: 500, crop: 'limit' }]
// });

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log("File filter - mimetype:", file.mimetype);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

export default upload;