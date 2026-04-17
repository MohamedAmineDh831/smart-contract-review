const Joi = require('joi');

const createQuestionSchema = Joi.object({
    productName: Joi.string().required().trim(),
    productDescription: Joi.string().required().trim(),
    productImageUrl: Joi.string().uri().allow(null, '').optional(),

    isOrderIdTracking: Joi.boolean().required(),

    reviewDate: Joi.when('isOrderIdTracking', {
        is: true,
        then: Joi.date().required(),
        otherwise: Joi.forbidden()
    }),

    excelFile: Joi.when('isOrderIdTracking', {
        is: false,
        then: Joi.string().required(),
        otherwise: Joi.forbidden()
    }),

    questions: Joi.array().items(Joi.any()).min(1).required()
});

module.exports = {
    createQuestionSchema
};