const crypto = require('crypto');

const addTraceId = (req, res, next) => {
    req.traceId = req.headers['x-correlation-id'] || crypto.randomUUID();

    res.setHeader('x-correlation-id', req.traceId);

    next();
};

module.exports = addTraceId;