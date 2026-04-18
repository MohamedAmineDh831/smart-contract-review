const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

        if (error) {
            const errorMessages = error.details.map((err) => err.message);
            return res.status(422).json({
                success: false,
                message: "Data validation error",
                data: errorMessages,
            });
        }

        req.body = value;
        next();
    };
};

module.exports = validate;