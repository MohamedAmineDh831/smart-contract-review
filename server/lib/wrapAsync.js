const { printErrorLog, formatErrorString } = require("./helper");

const wrapAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            console.error("🔥 ERROR CAUGHT BY WRAPASYNC:", err.message);
            try {
                if (typeof printErrorLog === 'function' && typeof formatErrorString === 'function') {
                    printErrorLog(`${req.originalUrl} catch: ` + formatErrorString(err));
                }
            } catch (loggerError) {
                console.error("⚠️ Logger failed but server stays alive:", loggerError.message);
            }
            next(err);
        });
    };
};

module.exports = { wrapAsync };