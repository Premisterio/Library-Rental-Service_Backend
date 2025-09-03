const jwt = require('jsonwebtoken');
const createError = require('http-errors');

if (!process.env.JWT_SECRET) {
    throw new Error('.env is missing a JWT secret');
}

if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('.env is missing a refresh token secret');
}

// JWT auth/verification middleware
const authenticateToken = (req, res, next) => {
    // Get token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(createError(401, 'Access token is required'));
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return next(createError(401, 'Token has expired'));
            }
            return next(createError(403, 'Invalid token'));
        }

        req.user = user;
        next();
    });
};

const generateToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { 
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
};

const generateRefreshToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET,
        { 
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
        }
    );
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        throw new Error('Invalid refresh token');
    }
};

module.exports = {
    authenticateToken,
    generateToken,
    generateRefreshToken,
    verifyRefreshToken,
};