/**
 * Product Model
 * Defines the dress/product schema for the catalog
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  
  // Pricing
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0
  },
  
  // Product Details
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Summer', 'Winter', 'Formal', 'Casual', 'Party', 'Wedding', 'Business', 'Vintage', 'Cocktail'],
    index: true
  },
  subcategory: {
    type: String,
    enum: ['Maxi', 'Mini', 'Midi', 'A-line', 'Bodycon', 'Shift', 'Wrap', 'Fit-and-flare']
  },
  
  // Variants
  sizes: [{
    size: {
      type: String,
      required: true,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0
    }
  }],
  
  colors: [{
    name: {
      type: String,
      required: true
    },
    hexCode: {
      type: String,
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color code']
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0
    }
  }],
  
  // Images
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    colorVariant: String
  }],
  
  // Specifications
  material: {
    type: String,
    required: [true, 'Material information is required']
  },
  careInstructions: [String],
  features: [String],
  
  // Measurements (in cm)
  measurements: {
    bust: Number,
    waist: Number,
    hips: Number,
    length: Number,
    sleeves: Number
  },
  
  // SEO and Marketing
  tags: [String],
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  metaTitle: String,
  metaDescription: String,
  
  // Status and Visibility
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'out-of-stock'],
    default: 'active',
    index: true
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  purchases: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  // Timestamps
  launchDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total stock
productSchema.virtual('totalStock').get(function() {
  return this.sizes.reduce((total, size) => total + size.stock, 0);
});

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return this.price - (this.price * this.discount / 100);
  }
  return this.price;
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images[0] ? this.images[0].url : null);
});

// Virtual for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product'
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ featured: -1, createdAt: -1 });
productSchema.index({ 'rating.average': -1 });

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Static method to get featured products
productSchema.statics.getFeatured = function(limit = 6) {
  return this.find({ featured: true, status: 'active' })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get products by category
productSchema.statics.getByCategory = function(category, limit = 12) {
  return this.find({ category, status: 'active' })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Instance method to check if product is in stock
productSchema.methods.isInStock = function(size, color) {
  if (size && color) {
    const sizeVariant = this.sizes.find(s => s.size === size);
    const colorVariant = this.colors.find(c => c.name === color);
    return sizeVariant && colorVariant && sizeVariant.stock > 0 && colorVariant.stock > 0;
  }
  return this.totalStock > 0;
};

// Instance method to update stock
productSchema.methods.updateStock = function(size, color, quantity) {
  const sizeIndex = this.sizes.findIndex(s => s.size === size);
  const colorIndex = this.colors.findIndex(c => c.name === color);
  
  if (sizeIndex !== -1 && colorIndex !== -1) {
    this.sizes[sizeIndex].stock -= quantity;
    this.colors[colorIndex].stock -= quantity;
    
    // Update status if out of stock
    if (this.totalStock === 0) {
      this.status = 'out-of-stock';
    }
  }
};

module.exports = mongoose.model('Product', productSchema);