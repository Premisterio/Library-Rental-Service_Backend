const User = require('../models/User');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const createError = require('http-errors');

const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
    });

    if (existingUser) {
        throw createError(409, 'User with this email or username already exists');
    }

    const user = new User({
        username,
        email,
        password
    });

    await user.save();

    const token = generateToken({ 
        id: user._id, 
        username: user.username
    });
    
    const refreshToken = generateRefreshToken({ 
        id: user._id 
    });

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token,
            refreshToken
        }
    });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw createError(400, 'Email and password are required');
    }

    const user = await User.findOne({ email, isActive: true }).select('+password');
    
    if (!user) {
        throw createError(401, 'Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
        throw createError(401, 'Invalid email or password');
    }

    const token = generateToken({ 
        id: user._id, 
        username: user.username
    });
    
    const refreshToken = generateRefreshToken({ 
        id: user._id 
    });

    res.json({
        success: true,
        message: 'Login successful',
        data: {
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token,
            refreshToken
        }
    });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
        throw createError(400, 'Refresh token is required');
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
        throw createError(401, 'Invalid refresh token');
    }

    const newToken = generateToken({ 
        id: user._id, 
        username: user.username
    });

    res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
            token: newToken
        }
    });
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    
    if (!user) {
        throw createError(404, 'User not found');
    }

    res.json({
        success: true,
        data: {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            }
        }
    });
});

const updatePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
        throw createError(400, 'Current password and new password are required');
    }

    const user = await User.findById(req.user.id).select('+password');
    
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
        throw createError(400, 'Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    res.json({
        success: true,
        message: 'Password updated successfully'
    });
});

module.exports = {
    register,
    login,
    refreshAccessToken,
    getCurrentUser,
    updatePassword
};