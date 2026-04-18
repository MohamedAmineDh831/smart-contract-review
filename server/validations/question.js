const Joi = require('joi');

const createQuestionSchema = Joi.object({
    productName: Joi.string().required().trim().messages({
        'string.base': 'Product name must be a text string.',
        'any.required': 'Product name is required.',
        'string.empty': 'Product name cannot be empty.'
    }),

    productDescription: Joi.string().required().trim().messages({
        'string.base': 'Product description must be a text string.',
        'any.required': 'Product description is required.',
        'string.empty': 'Product description cannot be empty.'
    }),

    productImageUrl: Joi.string().uri().required().messages({
        'string.base': 'Product image URL must be a text string.',
        'any.required': 'Product image URL is required.',
        'string.empty': 'Product image URL cannot be empty.',
        'string.uri': 'Product image URL must be a valid web link (e.g., http://...)'
    }),

    isOrderIdTracking: Joi.boolean().required().messages({
        'any.required': 'The isOrderIdTracking attribute is required.',
        'boolean.base': 'The isOrderIdTracking attribute must be a boolean (true or false).'
    }),

    reviewDate: Joi.when('isOrderIdTracking', {
        is: true,
        then: Joi.date().required().messages({
            'any.required': 'Review date is required because isOrderIdTracking is enabled.',
            'date.base': 'Review date format is invalid.'
        }),
        otherwise: Joi.forbidden().messages({
            'any.unknown': 'Review date must not be provided if isOrderIdTracking is disabled.'
        })
    }),

    excelFile: Joi.when('isOrderIdTracking', {
        is: false,
        then: Joi.string().required().messages({
            'string.base': 'Excel file path must be a text string.',
            'any.required': 'Excel file is required because isOrderIdTracking is disabled.',
            'string.empty': 'Excel file cannot be empty.'
        }),
        otherwise: Joi.forbidden().messages({
            'any.unknown': 'Excel file must not be provided if isOrderIdTracking is enabled.'
        })
    }),

    questions: Joi.array().items(Joi.any()).min(1).required().messages({
        'array.base': 'Questions must be an array (list).',
        'any.required': 'The questions list is required.',
        'array.min': 'You must provide at least one question in the list.'
    })
});

module.exports = {
    createQuestionSchema
};