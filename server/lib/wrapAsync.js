const { printErrorLog, formatErrorString } = require("./helper");

exports.wrapAsync = (func) => async (req, res, next) => {
    try {
        await func(req, res, next);
    } catch (error) {
        console.error("🔥 VRAIE ERREUR CRITIQUE :", error);

        if (typeof printErrorLog === 'function' && typeof formatErrorString === 'function') {
            printErrorLog(`${req.originalUrl} catch: ` + formatErrorString(error));
        }

        return next(error);
    }
};