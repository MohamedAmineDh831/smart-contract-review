const crypto = require('crypto');

const addTraceId = (req, res, next) => {
    // Si un service en amont (ex: Nginx) envoie déjà un ID, on le garde, sinon on en crée un
    req.traceId = req.headers['x-correlation-id'] || crypto.randomUUID();

    // On le renvoie aussi dans la réponse pour que le frontend/client puisse nous le donner en cas de bug
    res.setHeader('x-correlation-id', req.traceId);

    next();
};

module.exports = addTraceId;