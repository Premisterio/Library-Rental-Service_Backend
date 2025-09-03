const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const connectDB = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');
const { specs, swaggerUi } = require('./config/swagger');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const readerRoutes = require('./routes/readers');
const rentalRoutes = require('./routes/rentals');

const app = express();

connectDB();

// Middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Library Management API Documentation'
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/readers', readerRoutes);
app.use('/api/rentals', rentalRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: API root endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Book Rental System API is running!
 *                 documentation:
 *                   type: string
 *                   example: /api-docs
 */
app.get('/', (req, res) => {
    res.json({ 
        message: 'Book Rental System API is running!',
        documentation: '/api-docs'
    });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API is OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-01T00:00:00.000Z
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                   example: 3600
 */

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use('*', (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.status = 404;
    next(error);
});

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    console.log(`API started successfully!`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Swagger Documentation available on: http://localhost:${PORT}/api-docs/`);
});

// Error handling
process.on('unhandledRejection', (err) => {
    console.error('Promise Rejected:', err.message);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('Something went wrong:', err.message);
    process.exit(1);
});