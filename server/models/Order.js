/**
 * Order Model
 * Defines the order schema for purchase management
 */

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Order Identification
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  // User Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a user']
  },
  
  // Order Items
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    image: String,
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    size: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  
  // Pricing Details
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  shipping: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Shipping Information
  shippingAddress: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  
  // Payment Information
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'cod', 'wallet'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    paymentGateway: String
  },
  
  // Order Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending',
    index: true
  },
  
  // Tracking Information
  tracking: {
    carrier: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    actualDelivery: Date
  },
  
  // Order Timeline
  timeline: [{
    status: {
      type: String,
      required: true
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Additional Information
  notes: String,
  specialInstructions: String,
  
  // Dates
  confirmedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  
  // Customer Service
  customerService: {
    issues: [{
      type: String,
      description: String,
      status: {
        type: String,
        enum: ['open', 'in_progress', 'resolved'],
        default: 'open'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order age in days
orderSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Indexes for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD${Date.now()}${String(count + 1).padStart(4, '0')}`;
    
    // Add initial timeline entry
    this.timeline.push({
      status: 'pending',
      message: 'Order placed successfully',
      timestamp: new Date()
    });
  }
  next();
});

// Pre-save middleware to calculate totals
orderSchema.pre('save', function(next) {
  // Calculate subtotal from items
  this.subtotal = this.items.reduce((total, item) => {
    item.subtotal = item.price * item.quantity;
    return total + item.subtotal;
  }, 0);
  
  // Calculate total
  this.total = this.subtotal + this.tax + this.shipping - this.discount;
  
  next();
});

// Static method to get orders by status
orderSchema.statics.getByStatus = function(status, limit = 50) {
  return this.find({ status })
    .populate('user', 'firstName lastName email')
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get user orders
orderSchema.statics.getUserOrders = function(userId, limit = 20) {
  return this.find({ user: userId })
    .populate('items.product', 'name images slug')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Instance method to update status
orderSchema.methods.updateStatus = function(newStatus, message, updatedBy) {
  this.status = newStatus;
  
  // Add timeline entry
  this.timeline.push({
    status: newStatus,
    message: message || `Order status updated to ${newStatus}`,
    timestamp: new Date(),
    updatedBy
  });
  
  // Update specific date fields
  const now = new Date();
  switch (newStatus) {
    case 'confirmed':
      this.confirmedAt = now;
      break;
    case 'shipped':
      this.shippedAt = now;
      break;
    case 'delivered':
      this.deliveredAt = now;
      break;
    case 'cancelled':
      this.cancelledAt = now;
      break;
  }
  
  return this.save();
};

// Instance method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed', 'processing'].includes(this.status);
};

// Instance method to check if order can be returned
orderSchema.methods.canBeReturned = function() {
  if (this.status !== 'delivered') return false;
  
  const deliveryDate = this.deliveredAt || this.createdAt;
  const daysSinceDelivery = (Date.now() - deliveryDate) / (1000 * 60 * 60 * 24);
  
  return daysSinceDelivery <= 30; // 30 days return policy
};

module.exports = mongoose.model('Order', orderSchema);