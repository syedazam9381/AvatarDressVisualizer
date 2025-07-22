/**
 * Product Controller
 * Handles all product-related operations
 */

const Product = require('../models/Product');
const { validationResult } = require('express-validator');

/**
 * @desc    Get all products with filtering, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    // Build query object
    let query = { status: 'active' };
    
    // Filtering
    const { category, subcategory, minPrice, maxPrice, sizes, colors, featured, search } = req.query;
    
    if (category) {
      query.category = category;
    }
    
    if (subcategory) {
      query.subcategory = subcategory;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (sizes) {
      const sizeArray = sizes.split(',');
      query['sizes.size'] = { $in: sizeArray };
    }
    
    if (colors) {
      const colorArray = colors.split(',');
      query['colors.name'] = { $in: colorArray };
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Sorting
    let sortBy = {};
    const sort = req.query.sort;
    
    switch (sort) {
      case 'price_asc':
        sortBy.price = 1;
        break;
      case 'price_desc':
        sortBy.price = -1;
        break;
      case 'name_asc':
        sortBy.name = 1;
        break;
      case 'name_desc':
        sortBy.name = -1;
        break;
      case 'rating':
        sortBy['rating.average'] = -1;
        break;
      case 'newest':
        sortBy.createdAt = -1;
        break;
      default:
        sortBy.createdAt = -1;
    }
    
    // Execute query
    const products = await Product.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select('-__v');
    
    // Get total count for pagination
    const total = await Product.countDocuments(query);
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage,
        hasPrevPage,
        limit
      },
      data: products
    });
  } catch (error) {
    console.error('❌ Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get single product by ID or slug
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by ID first, then by slug
    let product = await Product.findById(id).populate('reviews');
    
    if (!product) {
      product = await Product.findOne({ slug: id }).populate('reviews');
    }
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Increment view count
    product.views += 1;
    await product.save({ validateBeforeSave: false });
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('❌ Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const products = await Product.getFeatured(limit);
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('❌ Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:category
 * @access  Public
 */
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const limit = parseInt(req.query.limit) || 12;
    
    const products = await Product.getByCategory(category, limit);
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('❌ Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products by category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Create new product (Admin only)
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('❌ Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update product (Admin only)
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('❌ Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Delete product (Admin only)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Soft delete by changing status
    product.status = 'inactive';
    await product.save();
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get product categories
 * @route   GET /api/products/categories
 * @access  Public
 */
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { status: 'active' });
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('❌ Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
};