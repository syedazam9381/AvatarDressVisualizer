# Setup Guide - Virtual Dress Try-On System

This guide will help you set up the Virtual Dress Try-On System on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/downloads)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

### Optional Tools
- **MongoDB Compass** - GUI for MongoDB
- **Postman** - API testing tool
- **Chrome DevTools** - Browser developer tools

## Installation Steps

### 1. Clone the Repository

```bash
# Clone the project repository
git clone https://github.com/yourusername/virtual-dress-tryon.git

# Navigate to project directory
cd virtual-dress-tryon
```

### 2. Backend Setup

#### Install Dependencies
```bash
# Navigate to server directory
cd server

# Install all dependencies
npm install
```

#### Environment Configuration
```bash
# Create environment file
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/dress-tryon-db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=5000000
UPLOAD_PATH=./uploads

# CORS Configuration
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

#### Database Setup
```bash
# Start MongoDB service (if not running)
# On Windows: net start MongoDB
# On macOS: brew services start mongodb-community
# On Linux: sudo systemctl start mongod

# Seed the database with sample data
npm run seed
```

#### Start Backend Server
```bash
# Start development server
npm run dev

# Server should start on http://localhost:5000
```

### 3. Frontend Setup

#### Install Dependencies
```bash
# Navigate to client directory (from project root)
cd client

# Install all dependencies
npm install
```

#### Environment Configuration
```bash
# Create environment file
cp .env.example .env
```

Edit the `.env` file:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Virtual Dress Try-On
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_CHAT_SUPPORT=false

# Development
VITE_DEBUG_MODE=true
```

#### Start Frontend Server
```bash
# Start development server
npm run dev

# Application should start on http://localhost:3000
```

## Verification

### 1. Check Backend API
Open your browser and navigate to:
- `http://localhost:5000/api/health` - Should return API health status
- `http://localhost:5000/api/products` - Should return product list

### 2. Check Frontend Application
Open your browser and navigate to:
- `http://localhost:3000` - Should display the homepage

### 3. Test Database Connection
```bash
# In server directory
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dress-tryon-db')
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection failed:', err));
"
```

## Default Accounts

After running the seed script, you can use these accounts:

### Admin Account
- **Email**: admin@dresstryon.com
- **Password**: admin123
- **Role**: Administrator

### Test User Account
- **Email**: john@example.com
- **Password**: password123
- **Role**: Regular User

## Development Workflow

### 1. Making Changes

#### Backend Changes
```bash
# Server automatically restarts with nodemon
# Make changes to files in server/ directory
# Check console for any errors
```

#### Frontend Changes
```bash
# Vite hot-reloads automatically
# Make changes to files in client/src/ directory
# Check browser console for any errors
```

### 2. Database Operations

#### View Database
```bash
# Using MongoDB Compass
# Connect to: mongodb://localhost:27017/dress-tryon-db

# Using MongoDB Shell
mongo dress-tryon-db
```

#### Reset Database
```bash
# In server directory
npm run seed
```

### 3. API Testing

#### Using Postman
1. Import the API collection (if available)
2. Set base URL to `http://localhost:5000/api`
3. Test authentication endpoints first
4. Use returned JWT token for protected routes

#### Using curl
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port in .env file
PORT=5001
```

#### MongoDB Connection Error
```bash
# Check if MongoDB is running
# Windows: services.msc -> MongoDB
# macOS: brew services list | grep mongodb
# Linux: sudo systemctl status mongod

# Start MongoDB if not running
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

#### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### CORS Issues
- Ensure CLIENT_URL in backend .env matches frontend URL
- Check browser console for CORS errors
- Verify API endpoints are accessible

### Environment Issues

#### Node.js Version
```bash
# Check Node.js version
node --version

# Should be v16.0.0 or higher
# Use nvm to manage Node.js versions if needed
```

#### MongoDB Version
```bash
# Check MongoDB version
mongod --version

# Should be v4.4 or higher
```

## Production Deployment

### Environment Variables
Update environment variables for production:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
CLIENT_URL=https://yourdomain.com
```

### Build Frontend
```bash
# In client directory
npm run build

# Serve build files with a web server
```

### Deploy Backend
```bash
# In server directory
npm start

# Use PM2 for production process management
npm install -g pm2
pm2 start server.js --name "dress-tryon-api"
```

## Additional Resources

### Documentation
- [React.js Documentation](https://reactjs.org/docs/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)

### Learning Resources
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [MongoDB University](https://university.mongodb.com/)

### Community Support
- [Stack Overflow](https://stackoverflow.com/)
- [GitHub Issues](https://github.com/yourusername/virtual-dress-tryon/issues)
- [Discord/Slack Communities](https://discord.com/)

---

**Need Help?**
If you encounter any issues during setup, please:
1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed error information
4. Contact the development team

**Happy Coding! 🚀**