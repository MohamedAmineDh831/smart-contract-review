const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        res.status(429).json({
            success: false,
            message: "Trop de requêtes effectuées depuis cette IP, veuillez réessayer dans 15 minutes."
        });
    }
});

const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        res.status(429).json({
            success: false,
            message: "Trop de tentatives. Par mesure de sécurité, veuillez patienter 1 minute."
        });
    }
});

module.exports = { apiLimiter, authLimiter };