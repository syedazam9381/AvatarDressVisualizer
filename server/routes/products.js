/**
 * Product Routes
 * Defines all product-related API endpoints
 */

const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules for product creation/update
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn(['Summer', 'Winter', 'Formal', 'Casual', 'Party', 'Wedding', 'Business', 'Vintage', 'Cocktail'])
    .withMessage('Please select a valid category'),
  body('material')
    .trim()
    .notEmpty()
    .withMessage('Material information is required'),
  body('sizes')
    .isArray({ min: 1 })
    .withMessage('At least one size must be provided'),
  body('colors')
    .isArray({ min: 1 })
    .withMessage('At least one color must be provided'),
  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one image must be provided')
];

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), productValidation, createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;