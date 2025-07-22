/**
 * Avatar Controller
 * Handles avatar upload and management operations
 */

const User = require('../models/User');
const fs = require('fs').promises;
const path = require('path');

/**
 * @desc    Upload user avatar
 * @route   POST /api/avatars/upload
 * @access  Private
 */
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete old avatar if exists
    if (user.avatar && user.avatar.imagePath) {
      try {
        await fs.unlink(user.avatar.imagePath);
      } catch (error) {
        console.log('Old avatar file not found or already deleted');
      }
    }

    // Update user avatar information
    user.avatar = {
      imagePath: req.file.path,
      originalName: req.file.originalname,
      uploadDate: new Date(),
      isActive: true
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar: {
          imagePath: req.file.path,
          originalName: req.file.originalname,
          uploadDate: user.avatar.uploadDate,
          isActive: user.avatar.isActive,
          url: `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`
        }
      }
    });
  } catch (error) {
    // Delete uploaded file if database operation fails
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }

    console.error('❌ Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading avatar',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get current user's avatar
 * @route   GET /api/avatars/me
 * @access  Private
 */
const getMyAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('avatar');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.avatar || !user.avatar.imagePath) {
      return res.status(404).json({
        success: false,
        message: 'No avatar found'
      });
    }

    // Check if file exists
    try {
      await fs.access(user.avatar.imagePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: 'Avatar file not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        avatar: {
          imagePath: user.avatar.imagePath,
          originalName: user.avatar.originalName,
          uploadDate: user.avatar.uploadDate,
          isActive: user.avatar.isActive,
          url: `${req.protocol}://${req.get('host')}/${user.avatar.imagePath.replace(/\\/g, '/')}`
        }
      }
    });
  } catch (error) {
    console.error('❌ Get avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching avatar',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Delete current user's avatar
 * @route   DELETE /api/avatars/me
 * @access  Private
 */
const deleteMyAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.avatar || !user.avatar.imagePath) {
      return res.status(404).json({
        success: false,
        message: 'No avatar found to delete'
      });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(user.avatar.imagePath);
    } catch (error) {
      console.log('Avatar file not found or already deleted');
    }

    // Remove avatar from user document
    user.avatar = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Avatar deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting avatar',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update avatar status (activate/deactivate)
 * @route   PUT /api/avatars/me/status
 * @access  Private
 */
const updateAvatarStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be a boolean value'
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.avatar) {
      return res.status(404).json({
        success: false,
        message: 'No avatar found'
      });
    }

    user.avatar.isActive = isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Avatar ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        avatar: {
          imagePath: user.avatar.imagePath,
          originalName: user.avatar.originalName,
          uploadDate: user.avatar.uploadDate,
          isActive: user.avatar.isActive,
          url: `${req.protocol}://${req.get('host')}/${user.avatar.imagePath.replace(/\\/g, '/')}`
        }
      }
    });
  } catch (error) {
    console.error('❌ Update avatar status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating avatar status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  uploadAvatar,
  getMyAvatar,
  deleteMyAvatar,
  updateAvatarStatus
};