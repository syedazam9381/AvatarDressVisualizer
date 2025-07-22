/**
 * Avatar Routes
 * Defines all avatar-related API endpoints
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  uploadAvatar,
  getMyAvatar,
  deleteMyAvatar,
  updateAvatarStatus
} = require('../controllers/avatarController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars/');
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter
});

// All routes require authentication
router.use(protect);

// Routes
router.post('/upload', upload.single('avatar'), uploadAvatar);
router.get('/me', getMyAvatar);
router.delete('/me', deleteMyAvatar);
router.put('/me/status', updateAvatarStatus);

module.exports = router;