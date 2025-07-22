/**
 * Order Routes
 * Defines all order-related API endpoints
 */

const express = require('express');
const { body } = require('express-validator');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules for order creation
const createOrderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.product')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('items.*.size')
    .notEmpty()
    .withMessage('Size is required'),
  body('items.*.color')
    .notEmpty()
    .withMessage('Color is required'),
  body('shippingAddress.firstName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('First name is required'),
  body('shippingAddress.lastName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Last name is required'),
  body('shippingAddress.email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('shippingAddress.phone')
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('shippingAddress.street')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .trim()
    .isLength({ min: 2 })
    .withMessage('City is required'),
  body('shippingAddress.state')
    .trim()
    .isLength({ min: 2 })
    .withMessage('State is required'),
  body('shippingAddress.zipCode')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Valid zip code is required'),
  body('payment.method')
    .isIn(['credit_card', 'debit_card', 'upi', 'net_banking', 'cod', 'wallet'])
    .withMessage('Invalid payment method')
];

// Protected routes (User)
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);
router.post('/', protect, createOrderValidation, createOrder);
router.put('/:id/cancel', protect, cancelOrder);

// Protected routes (Admin only)
router.get('/admin/all', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;