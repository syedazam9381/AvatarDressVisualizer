/**
 * 404 Not Found Middleware
 * Handles requests to non-existent routes
 */

const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  res.status(404).json({
    success: false,
    message: error.message,
    availableRoutes: {
      auth: [
        'POST /api/auth/register',
        'POST /api/auth/login',
        'GET /api/auth/me',
        'PUT /api/auth/profile',
        'PUT /api/auth/change-password',
        'POST /api/auth/logout'
      ],
      products: [
        'GET /api/products',
        'GET /api/products/featured',
        'GET /api/products/categories',
        'GET /api/products/category/:category',
        'GET /api/products/:id',
        'POST /api/products (Admin)',
        'PUT /api/products/:id (Admin)',
        'DELETE /api/products/:id (Admin)'
      ],
      orders: [
        'GET /api/orders',
        'GET /api/orders/:id',
        'POST /api/orders',
        'PUT /api/orders/:id/status (Admin)'
      ],
      users: [
        'GET /api/users (Admin)',
        'GET /api/users/:id (Admin)',
        'PUT /api/users/:id (Admin)',
        'DELETE /api/users/:id (Admin)'
      ],
      avatars: [
        'POST /api/avatars/upload',
        'GET /api/avatars/me',
        'DELETE /api/avatars/me'
      ],
      health: [
        'GET /api/health'
      ]
    }
  });
};

module.exports = notFound;