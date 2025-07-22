/**
 * Virtual Dress Try-On System - Backend Server
 * B.Tech Final Year Project
 * 
 * Main server file that initializes the Express application,
 * connects to MongoDB database, and sets up all middleware and routes.
 * 
 * @author B.Tech Student
 * @version 1.0.0
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const path = require('path');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const avatarRoutes = require('./routes/avatars');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Initialize Express app
const app = express();

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api/', limiter);

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CLIENT_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// Static files middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
const API_PREFIX = process.env.API_PREFIX || '/api';

// Health check endpoint
app.get(`${API_PREFIX}/health`, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Virtual Dress Try-On API is running successfully! 🚀',
    data: {
      service: 'Virtual Dress Try-On System',
      version: '1.0.0',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      author: 'B.Tech Student',
      project: 'Final Year Project'
    }
  });
});

// API documentation endpoint
app.get(`${API_PREFIX}/docs`, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Documentation',
    endpoints: {
      authentication: {
        register: `POST ${API_PREFIX}/auth/register`,
        login: `POST ${API_PREFIX}/auth/login`,
        profile: `GET ${API_PREFIX}/auth/me`,
        updateProfile: `PUT ${API_PREFIX}/auth/profile`,
        changePassword: `PUT ${API_PREFIX}/auth/change-password`,
        logout: `POST ${API_PREFIX}/auth/logout`
      },
      products: {
        getAll: `GET ${API_PREFIX}/products`,
        getById: `GET ${API_PREFIX}/products/:id`,
        getFeatured: `GET ${API_PREFIX}/products/featured`,
        getByCategory: `GET ${API_PREFIX}/products/category/:category`,
        getCategories: `GET ${API_PREFIX}/products/categories`,
        create: `POST ${API_PREFIX}/products (Admin)`,
        update: `PUT ${API_PREFIX}/products/:id (Admin)`,
        delete: `DELETE ${API_PREFIX}/products/:id (Admin)`
      },
      orders: {
        getUserOrders: `GET ${API_PREFIX}/orders`,
        getById: `GET ${API_PREFIX}/orders/:id`,
        create: `POST ${API_PREFIX}/orders`,
        updateStatus: `PUT ${API_PREFIX}/orders/:id/status (Admin)`,
        cancel: `PUT ${API_PREFIX}/orders/:id/cancel`
      },
      users: {
        getAll: `GET ${API_PREFIX}/users (Admin)`,
        getById: `GET ${API_PREFIX}/users/:id (Admin)`,
        update: `PUT ${API_PREFIX}/users/:id (Admin)`,
        delete: `DELETE ${API_PREFIX}/users/:id (Admin)`
      },
      avatars: {
        upload: `POST ${API_PREFIX}/avatars/upload`,
        getMe: `GET ${API_PREFIX}/avatars/me`,
        deleteMe: `DELETE ${API_PREFIX}/avatars/me`
      }
    }
  });
});

// Mount API routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/avatars`, avatarRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Database connection and server startup
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log('\n🚀 ===== SERVER STARTED SUCCESSFULLY =====');
      console.log(`📱 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log(`🔗 API URL: http://localhost:${PORT}${API_PREFIX}`);
      console.log(`💻 Client URL: ${process.env.CLIENT_URL}`);
      console.log(`📊 Health Check: http://localhost:${PORT}${API_PREFIX}/health`);
      console.log(`📚 API Docs: http://localhost:${PORT}${API_PREFIX}/docs`);
      console.log('==========================================\n');
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🔄 SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Process terminated');
        mongoose.connection.close();
      });
    });

    process.on('SIGINT', () => {
      console.log('\n🔄 SIGINT received. Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Process terminated');
        mongoose.connection.close();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  console.error('🔍 Promise:', promise);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error('📍 Stack:', err.stack);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;