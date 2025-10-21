const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
require('dotenv').config();


const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const orderRoutes = require('./routes/orders');
const blogRoutes = require('./routes/blog');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payments');
const galleryRoutes = require('./routes/gallery');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - allow specific production domains and local dev
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'https://www.nawasohail.com',
      'https://nawasohail.com',
      'https://writer-server.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    if (process.env.NODE_ENV === 'development' || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// Explicitly enable preflight for all routes
app.options('*', cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      connectTimeoutMS: 30000,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Connection event handlers
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Connect to database
connectDB();

// Root route - API documentation
app.get('/', (req, res) => {
  res.json({
    message: 'Writer Server API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      auth: '/api/auth',
      books: '/api/books',
      orders: '/api/orders',
      blog: '/api/blog',
      reviews: '/api/reviews',
      users: '/api/users',
      payments: '/api/payments',
      gallery: '/api/gallery',
      health: '/api/health'
    },
    documentation: 'Available endpoints listed above'
  });
});

// API root route
app.get('/api', (req, res) => {
  res.json({
    message: 'Writer Server API v1.0.0',
    status: 'Running',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/health - Health check',
      'POST /api/auth/register - User registration',
      'POST /api/auth/login - User login',
      'GET /api/books - Get all books',
      'POST /api/books - Create new book',
      'GET /api/blog - Get blog posts',
      'POST /api/blog - Create blog post',
      'GET /api/gallery - Get gallery images',
      'POST /api/gallery - Upload gallery image',
      'GET /api/reviews - Get reviews',
      'POST /api/reviews - Create review',
      'GET /api/orders - Get orders',
      'POST /api/orders - Create order',
      'POST /api/payments/process - Process payment'
    ]
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/gallery', galleryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    suggestion: 'Visit / or /api for available endpoints',
    availableRoutes: [
      '/',
      '/api',
      '/api/health',
      '/api/auth/*',
      '/api/books/*',
      '/api/blog/*',
      '/api/gallery/*',
      '/api/reviews/*',
      '/api/orders/*',
      '/api/payments/*',
      '/api/users/*'
    ]
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Graceful shutdown...');
  await mongoose.connection.close();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Graceful shutdown...');
  await mongoose.connection.close();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});