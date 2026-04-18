const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req, res) => process.env.NODE_ENV === 'test',
    handler: (req, res, next, options) => {
        res.status(429).json({
            success: false,
            message: "Too many requests from this IP, please try again in 15 minutes."
        });
    }
});

const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req, res) => process.env.NODE_ENV === 'test',
    handler: (req, res, next, options) => {
        res.status(429).json({
            success: false,
            message: "Too many attempts. For security reasons, please wait 1 minute."
        });
    }
});

module.exports = { apiLimiter, authLimiter };