/**
 * Database Seeder Script
 * Populates the database with sample data for development and testing
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@dresstryon.com',
    password: 'admin123',
    role: 'admin',
    phone: '9876543210',
    isActive: true,
    isEmailVerified: true
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    phone: '9876543211',
    isActive: true,
    isEmailVerified: true,
    addresses: [{
      type: 'home',
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India',
      isDefault: true
    }]
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    phone: '9876543212',
    isActive: true,
    isEmailVerified: true,
    addresses: [{
      type: 'home',
      street: '456 Oak Avenue',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India',
      isDefault: true
    }]
  }
];

const sampleProducts = [
  {
    name: 'Elegant Floral Summer Dress',
    description: 'A beautiful floral dress perfect for summer occasions. Made with breathable cotton fabric and featuring a flattering A-line silhouette.',
    shortDescription: 'Beautiful floral summer dress with A-line silhouette',
    price: 2499,
    originalPrice: 3499,
    discount: 28,
    category: 'Summer',
    subcategory: 'A-line',
    sizes: [
      { size: 'XS', stock: 10 },
      { size: 'S', stock: 15 },
      { size: 'M', stock: 20 },
      { size: 'L', stock: 15 },
      { size: 'XL', stock: 10 }
    ],
    colors: [
      { name: 'Pink', hexCode: '#FFC0CB', stock: 25 },
      { name: 'Blue', hexCode: '#87CEEB', stock: 20 },
      { name: 'Yellow', hexCode: '#FFFFE0', stock: 25 }
    ],
    images: [
      { url: 'https://via.placeholder.com/600x800/FFC0CB/000000?text=Floral+Dress+1', alt: 'Floral Summer Dress Front', isPrimary: true },
      { url: 'https://via.placeholder.com/600x800/FFC0CB/000000?text=Floral+Dress+2', alt: 'Floral Summer Dress Back' }
    ],
    material: '100% Cotton',
    careInstructions: ['Machine wash cold', 'Tumble dry low', 'Iron on low heat'],
    features: ['Breathable fabric', 'A-line silhouette', 'Knee-length', 'Short sleeves'],
    measurements: { bust: 86, waist: 70, hips: 96, length: 95, sleeves: 20 },
    tags: ['summer', 'floral', 'casual', 'cotton', 'a-line'],
    status: 'active',
    featured: true,
    isNewArrival: true
  },
  {
    name: 'Classic Black Evening Gown',
    description: 'An elegant black evening gown perfect for formal events and special occasions. Features a sophisticated design with premium fabric.',
    shortDescription: 'Elegant black evening gown for formal events',
    price: 5999,
    originalPrice: 7999,
    discount: 25,
    category: 'Formal',
    subcategory: 'Bodycon',
    sizes: [
      { size: 'S', stock: 8 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 10 },
      { size: 'XL', stock: 6 }
    ],
    colors: [
      { name: 'Black', hexCode: '#000000', stock: 20 },
      { name: 'Navy', hexCode: '#000080', stock: 16 }
    ],
    images: [
      { url: 'https://via.placeholder.com/600x800/000000/FFFFFF?text=Evening+Gown+1', alt: 'Black Evening Gown Front', isPrimary: true },
      { url: 'https://via.placeholder.com/600x800/000000/FFFFFF?text=Evening+Gown+2', alt: 'Black Evening Gown Side' }
    ],
    material: 'Polyester blend with satin finish',
    careInstructions: ['Dry clean only', 'Store on hanger', 'Avoid direct sunlight'],
    features: ['Floor-length', 'Bodycon fit', 'Sleeveless', 'Back zipper'],
    measurements: { bust: 84, waist: 68, hips: 94, length: 150, sleeves: 0 },
    tags: ['formal', 'evening', 'black', 'elegant', 'bodycon'],
    status: 'active',
    featured: true,
    isNewArrival: false
  },
  {
    name: 'Comfortable Casual Maxi Dress',
    description: 'A comfortable maxi dress perfect for everyday wear. Made with soft jersey fabric for all-day comfort.',
    shortDescription: 'Comfortable maxi dress for everyday wear',
    price: 1999,
    originalPrice: 2499,
    discount: 20,
    category: 'Casual',
    subcategory: 'Maxi',
    sizes: [
      { size: 'XS', stock: 12 },
      { size: 'S', stock: 18 },
      { size: 'M', stock: 25 },
      { size: 'L', stock: 20 },
      { size: 'XL', stock: 15 },
      { size: 'XXL', stock: 10 }
    ],
    colors: [
      { name: 'Green', hexCode: '#90EE90', stock: 30 },
      { name: 'Blue', hexCode: '#87CEEB', stock: 35 },
      { name: 'Brown', hexCode: '#D2B48C', stock: 35 }
    ],
    images: [
      { url: 'https://via.placeholder.com/600x800/90EE90/000000?text=Maxi+Dress+1', alt: 'Casual Maxi Dress Front', isPrimary: true },
      { url: 'https://via.placeholder.com/600x800/90EE90/000000?text=Maxi+Dress+2', alt: 'Casual Maxi Dress Detail' }
    ],
    material: 'Jersey cotton blend',
    careInstructions: ['Machine wash warm', 'Tumble dry medium', 'Iron if needed'],
    features: ['Maxi length', 'Relaxed fit', 'Long sleeves', 'Side pockets'],
    measurements: { bust: 90, waist: 74, hips: 100, length: 140, sleeves: 60 },
    tags: ['casual', 'maxi', 'comfortable', 'everyday', 'jersey'],
    status: 'active',
    featured: true,
    isNewArrival: false
  },
  {
    name: 'Stylish Cocktail Party Dress',
    description: 'A stylish cocktail dress perfect for parties and social events. Features modern design with attention to detail.',
    shortDescription: 'Stylish cocktail dress for parties',
    price: 3499,
    originalPrice: 4499,
    discount: 22,
    category: 'Cocktail',
    subcategory: 'Fit-and-flare',
    sizes: [
      { size: 'XS', stock: 8 },
      { size: 'S', stock: 12 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 12 }
    ],
    colors: [
      { name: 'Purple', hexCode: '#800080', stock: 20 },
      { name: 'Black', hexCode: '#000000', stock: 15 },
      { name: 'Silver', hexCode: '#C0C0C0', stock: 12 }
    ],
    images: [
      { url: 'https://via.placeholder.com/600x800/800080/FFFFFF?text=Cocktail+Dress+1', alt: 'Cocktail Dress Front', isPrimary: true },
      { url: 'https://via.placeholder.com/600x800/800080/FFFFFF?text=Cocktail+Dress+2', alt: 'Cocktail Dress Back' }
    ],
    material: 'Polyester with sequin details',
    careInstructions: ['Hand wash cold', 'Lay flat to dry', 'Professional cleaning recommended'],
    features: ['Knee-length', 'Fit-and-flare', 'Sequin details', 'Sleeveless'],
    measurements: { bust: 82, waist: 66, hips: 92, length: 90, sleeves: 0 },
    tags: ['cocktail', 'party', 'sequin', 'stylish', 'fit-and-flare'],
    status: 'active',
    featured: false,
    isNewArrival: true
  },
  {
    name: 'Professional Business Dress',
    description: 'A professional dress perfect for office and business meetings. Combines style with comfort for the modern working woman.',
    shortDescription: 'Professional dress for office wear',
    price: 3999,
    originalPrice: 4999,
    discount: 20,
    category: 'Business',
    subcategory: 'Shift',
    sizes: [
      { size: 'S', stock: 15 },
      { size: 'M', stock: 20 },
      { size: 'L', stock: 18 },
      { size: 'XL', stock: 12 }
    ],
    colors: [
      { name: 'Navy', hexCode: '#000080', stock: 25 },
      { name: 'Gray', hexCode: '#808080', stock: 20 },
      { name: 'Black', hexCode: '#000000', stock: 20 }
    ],
    images: [
      { url: 'https://via.placeholder.com/600x800/000080/FFFFFF?text=Business+Dress+1', alt: 'Business Dress Front', isPrimary: true },
      { url: 'https://via.placeholder.com/600x800/000080/FFFFFF?text=Business+Dress+2', alt: 'Business Dress Side' }
    ],
    material: 'Wool blend with stretch',
    careInstructions: ['Dry clean preferred', 'Machine wash cold if needed', 'Hang to dry'],
    features: ['Knee-length', 'Professional cut', 'Long sleeves', 'Wrinkle-resistant'],
    measurements: { bust: 88, waist: 72, hips: 98, length: 100, sleeves: 58 },
    tags: ['business', 'professional', 'office', 'formal', 'shift'],
    status: 'active',
    featured: false,
    isNewArrival: false
  }
];

// Seed functions
const seedUsers = async () => {
  try {
    await User.deleteMany();
    console.log('🗑️  Users collection cleared');

    const users = await User.create(sampleUsers);
    console.log(`✅ ${users.length} users created`);
    return users;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log('🗑️  Products collection cleared');

    const products = await Product.create(sampleProducts);
    console.log(`✅ ${products.length} products created`);
    return products;
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
};

const seedOrders = async (users, products) => {
  try {
    await Order.deleteMany();
    console.log('🗑️  Orders collection cleared');

    // Create sample orders
    const sampleOrders = [
      {
        user: users[1]._id, // John Doe
        items: [
          {
            product: products[0]._id,
            name: products[0].name,
            image: products[0].images[0].url,
            price: products[0].price,
            quantity: 1,
            size: 'M',
            color: 'Pink',
            subtotal: products[0].price
          }
        ],
        shippingAddress: users[1].addresses[0],
        payment: {
          method: 'credit_card',
          status: 'completed',
          transactionId: 'TXN123456789',
          paidAt: new Date(),
          paymentGateway: 'Razorpay'
        },
        status: 'delivered',
        deliveredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        user: users[2]._id, // Jane Smith
        items: [
          {
            product: products[1]._id,
            name: products[1].name,
            image: products[1].images[0].url,
            price: products[1].price,
            quantity: 1,
            size: 'L',
            color: 'Black',
            subtotal: products[1].price
          },
          {
            product: products[2]._id,
            name: products[2].name,
            image: products[2].images[0].url,
            price: products[2].price,
            quantity: 2,
            size: 'M',
            color: 'Blue',
            subtotal: products[2].price * 2
          }
        ],
        shippingAddress: users[2].addresses[0],
        payment: {
          method: 'upi',
          status: 'completed',
          transactionId: 'UPI987654321',
          paidAt: new Date(),
          paymentGateway: 'PhonePe'
        },
        status: 'shipped',
        shippedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        tracking: {
          carrier: 'Blue Dart',
          trackingNumber: 'BD123456789',
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
        }
      }
    ];

    const orders = await Order.create(sampleOrders);
    console.log(`✅ ${orders.length} orders created`);
    return orders;
  } catch (error) {
    console.error('❌ Error seeding orders:', error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    
    const users = await seedUsers();
    const products = await seedProducts();
    const orders = await seedOrders(users, products);
    
    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Orders: ${orders.length}`);
    console.log('');
    console.log('🔐 Admin credentials:');
    console.log('   Email: admin@dresstryon.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('👤 Test user credentials:');
    console.log('   Email: john@example.com');
    console.log('   Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase,
  seedUsers,
  seedProducts,
  seedOrders
};