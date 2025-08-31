const createError = require('http-errors');

// Global error handling
const errorHandler = (error, req, res, next) => {
    let err = error;

    if (!err.status && !err.statusCode) {
        err = createError(500, err.message || 'Internal Server Error');
    }

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        err = createError(400, `Validation Error: ${message}`);
    }

    // Invalid ObjectId
    if (err.name === 'CastError') {
        const message = `Invalid ${err.path}: ${err.value}`;
        err = createError(400, message);
    }

    // Duplicate key errors
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        const message = `Duplicate value for ${field}: ${value}`;
        err = createError(409, message);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        err = createError(401, 'Invalid token');
    }

    if (err.name === 'TokenExpiredError') {
        err = createError(401, 'Token expired');
    }

    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Send error response
    res.status(statusCode).json({
        success: false,
        error: {
            message: message,
            status: statusCode,
        }
    });
};

// 404
const notFound = (req, res, next) => {
    const message = `Route ${req.originalUrl} not found`;
    next(createError(404, message));
};

// Async error handler
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    errorHandler,
    notFound,
    asyncHandler
};