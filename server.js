const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// TODO: Create and import routes
// const bookRoutes = require('./routes/books');
// const readerRoutes = require('./routes/readers');
// const rentalRoutes = require('./routes/rentals');
// const authRoutes = require('./routes/auth');

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

// TODO: API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/books', bookRoutes);
// app.use('/api/readers', readerRoutes);
// app.use('/api/rentals', rentalRoutes);

app.get('/', (req, res) => {
    res.json({ 
        message: 'Library Rental System API is running!'
    });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404
app.use('*', (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.status = 404;
    next(error);
});

app.use(errorHandler);

const PORT = process.env.PORT;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API started successfully!`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
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
