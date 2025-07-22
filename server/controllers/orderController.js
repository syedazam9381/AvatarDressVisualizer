/**
 * Order Controller
 * Handles all order-related operations
 */

const Order = require('../models/Order');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

/**
 * @desc    Get all orders for authenticated user
 * @route   GET /api/orders
 * @access  Private
 */
const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    
    let query = { user: req.user.id };
    
    if (status) {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .populate('items.product', 'name images slug')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Order.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
        limit
      },
      data: orders
    });
  } catch (error) {
    console.error('❌ Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images slug');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('❌ Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { items, shippingAddress, payment } = req.body;
    
    // Validate and process order items
    const processedItems = [];
    let subtotal = 0;
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }
      
      if (!product.isInStock(item.size, item.color)) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is out of stock for size ${item.size} and color ${item.color}`
        });
      }
      
      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;
      
      processedItems.push({
        product: product._id,
        name: product.name,
        image: product.primaryImage,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        subtotal: itemSubtotal
      });
      
      // Update product stock
      product.updateStock(item.size, item.color, item.quantity);
      await product.save();
    }
    
    // Calculate totals
    const tax = subtotal * 0.18; // 18% GST
    const shipping = subtotal > 1000 ? 0 : 100; // Free shipping above ₹1000
    const total = subtotal + tax + shipping;
    
    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: processedItems,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress,
      payment: {
        ...payment,
        status: payment.method === 'cod' ? 'pending' : 'completed',
        paidAt: payment.method !== 'cod' ? new Date() : undefined
      }
    });
    
    // Populate order for response
    await order.populate('items.product', 'name images slug');
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('❌ Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update order status (Admin only)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status, message } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    await order.updateStatus(status, message, req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('❌ Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    if (!order.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }
    
    await order.updateStatus('cancelled', 'Order cancelled by customer', req.user.id);
    
    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
        const colorIndex = product.colors.findIndex(c => c.name === item.color);
        
        if (sizeIndex !== -1 && colorIndex !== -1) {
          product.sizes[sizeIndex].stock += item.quantity;
          product.colors[colorIndex].stock += item.quantity;
          await product.save();
        }
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('❌ Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get all orders (Admin only)
 * @route   GET /api/orders/admin/all
 * @access  Private/Admin
 */
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Order.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
        limit
      },
      data: orders
    });
  } catch (error) {
    console.error('❌ Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching all orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders
};