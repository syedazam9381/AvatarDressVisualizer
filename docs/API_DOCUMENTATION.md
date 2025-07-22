# API Documentation - Virtual Dress Try-On System

## Overview
This document provides comprehensive information about the REST API endpoints for the Virtual Dress Try-On System.

### Base URL
```
http://localhost:5000/api
```

### Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Login User
**POST** `/auth/login`

Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Get Current User
**GET** `/auth/me`

Get current authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "user",
    "addresses": [],
    "preferences": {},
    "isEmailVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Product Endpoints

### Get All Products
**GET** `/products`

Get all products with filtering, sorting, and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `category` (string): Filter by category
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `sizes` (string): Comma-separated sizes (e.g., "S,M,L")
- `colors` (string): Comma-separated colors
- `featured` (boolean): Filter featured products
- `search` (string): Search in name and description
- `sort` (string): Sort by (price_asc, price_desc, name_asc, name_desc, rating, newest)

**Response:**
```json
{
  "success": true,
  "count": 12,
  "total": 50,
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false,
    "limit": 12
  },
  "data": [
    {
      "id": "product_id",
      "name": "Elegant Floral Summer Dress",
      "description": "A beautiful floral dress...",
      "price": 2499,
      "originalPrice": 3499,
      "discount": 28,
      "category": "Summer",
      "sizes": [
        {"size": "S", "stock": 15},
        {"size": "M", "stock": 20}
      ],
      "colors": [
        {"name": "Pink", "hexCode": "#FFC0CB", "stock": 25}
      ],
      "images": [
        {"url": "image_url", "alt": "Product image", "isPrimary": true}
      ],
      "featured": true,
      "status": "active"
    }
  ]
}
```

### Get Single Product
**GET** `/products/:id`

Get a single product by ID or slug.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "product_id",
    "name": "Elegant Floral Summer Dress",
    "description": "A beautiful floral dress perfect for summer occasions...",
    "price": 2499,
    "originalPrice": 3499,
    "discount": 28,
    "category": "Summer",
    "subcategory": "A-line",
    "sizes": [
      {"size": "XS", "stock": 10},
      {"size": "S", "stock": 15},
      {"size": "M", "stock": 20}
    ],
    "colors": [
      {"name": "Pink", "hexCode": "#FFC0CB", "stock": 25},
      {"name": "Blue", "hexCode": "#87CEEB", "stock": 20}
    ],
    "images": [
      {"url": "image_url", "alt": "Product image", "isPrimary": true}
    ],
    "material": "100% Cotton",
    "careInstructions": ["Machine wash cold", "Tumble dry low"],
    "features": ["Breathable fabric", "A-line silhouette"],
    "measurements": {
      "bust": 86,
      "waist": 70,
      "hips": 96,
      "length": 95
    },
    "tags": ["summer", "floral", "casual"],
    "status": "active",
    "featured": true,
    "views": 150,
    "rating": {
      "average": 4.5,
      "count": 25
    }
  }
}
```

### Get Featured Products
**GET** `/products/featured`

Get featured products.

**Query Parameters:**
- `limit` (number): Number of products to return (default: 6)

### Get Products by Category
**GET** `/products/category/:category`

Get products by specific category.

### Get Categories
**GET** `/products/categories`

Get all available product categories.

**Response:**
```json
{
  "success": true,
  "data": ["Summer", "Winter", "Formal", "Casual", "Party"]
}
```

---

## Order Endpoints

### Create Order
**POST** `/orders`

Create a new order.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "items": [
    {
      "product": "product_id",
      "quantity": 1,
      "size": "M",
      "color": "Pink"
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  },
  "payment": {
    "method": "credit_card",
    "transactionId": "TXN123456789"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "order_id",
    "orderNumber": "ORD1234567890001",
    "status": "pending",
    "total": 2499,
    "items": [...],
    "shippingAddress": {...},
    "payment": {...},
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get User Orders
**GET** `/orders`

Get all orders for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by order status

### Get Single Order
**GET** `/orders/:id`

Get a single order by ID.

**Headers:** `Authorization: Bearer <token>`

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

---

## Rate Limiting

API requests are limited to 100 requests per 15-minute window per IP address.

When rate limit is exceeded, the API returns:
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

---

## Pagination

Endpoints that return multiple items support pagination:

**Query Parameters:**
- `page` - Page number (starts from 1)
- `limit` - Number of items per page

**Response includes pagination info:**
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false,
    "limit": 12
  }
}
```

---

## File Uploads

For endpoints that accept file uploads, use `multipart/form-data` content type.

**Maximum file size:** 5MB
**Supported formats:** JPG, PNG, GIF

---

## Development Notes

- All timestamps are in ISO 8601 format
- Prices are in Indian Rupees (INR) as integers (paise)
- All text fields support UTF-8 encoding
- API responses are always in JSON format