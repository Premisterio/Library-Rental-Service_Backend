const jwt = require('jsonwebtoken');
const createError = require('http-errors');

if (!process.env.JWT_SECRET) {
    throw new Error('.env is missing a JWT secret');
}

if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('.env is missing a refresh token secret');
}

// Roles
const ROLES = {
    admin: 3,
    librarian: 2,
    reader: 1
};

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

// Role-based access control
const requireRole = (minRole) => {
    return (req, res, next) => {

        if (!req.user) {
            return next(createError(401, 'Authentication required'));
        }

        // Check role level
        const userRoleLevel = ROLES[req.user.role] || 0;
        const requiredRoleLevel = ROLES[minRole] || 0;

        if (userRoleLevel < requiredRoleLevel) {
            return next(createError(403, `${minRole} access required`));
        }

        next();
    };
};

const requireAdmin = requireRole('admin');
const requireLibrarian = requireRole('librarian');
const requireReader = requireRole('reader');

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

// Check user ownership or librarian access
const requireOwnershipOrLibrarian = (resourceUserIdField = 'reader') => {
    return (req, res, next) => {
        if (!req.user) {
            return next(createError(401, 'Authentication required'));
        }
        
        if (req.user.role === 'admin' || req.user.role === 'librarian') {
            return next();
        }

        // Check if user owns the resource
        const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
        if (req.user.id === resourceUserId || req.user._id === resourceUserId) {
            return next();
        }

        return next(createError(403, 'Access denied'));
    };
};

module.exports = {
    authenticateToken,
    requireAdmin,
    requireLibrarian,
    requireReader,
    requireRole,
    requireOwnershipOrLibrarian,
    generateToken,
    generateRefreshToken,
    verifyRefreshToken,
    optionalAuth,
    ROLES
};