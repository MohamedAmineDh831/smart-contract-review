const Joi = require('joi');

const createCustomerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().trim().messages({
        'string.base': 'Name must be a text string.',
        'string.empty': 'Name cannot be empty.',
        'string.min': 'Name must be at least 2 characters long.',
        'string.max': 'Name cannot exceed 100 characters.',
        'any.required': 'Name is required.'
    }),

    companyEmail: Joi.string().email().required().trim().messages({
        'string.base': 'Company email must be a text string.',
        'string.empty': 'Company email cannot be empty.',
        'string.email': 'Company email must be a valid email address.',
        'any.required': 'Company email is required.'
    }),

    walletAddress: Joi.string().length(56).pattern(/^G/).required().messages({
        'string.base': 'Wallet address must be a text string.',
        'string.empty': 'Wallet address cannot be empty.',
        'string.length': 'Wallet address must be exactly 56 characters long.',
        'string.pattern.base': 'Wallet address must be a valid public address starting with the letter "G".',
        'any.required': 'Wallet address is required.'
    })
});

const loginCustomerSchema = Joi.object({
    walletAddress: Joi.string().required().trim().messages({
        'string.base': 'Wallet address must be a text string.',
        'string.empty': 'Wallet address cannot be empty.',
        'any.required': 'Wallet address is required for login.'
    })
});

const sendOtpSchema = Joi.object({
    email: Joi.string().email().required().trim().messages({
        'string.base': 'Email must be a text string.',
        'string.empty': 'Email cannot be empty.',
        'string.email': 'Please provide a valid email address.',
        'any.required': 'Email is required to send OTP.'
    }),

    otp: Joi.string().length(6).required().messages({
        'string.base': 'OTP must be a text string.',
        'string.empty': 'OTP cannot be empty.',
        'string.length': 'OTP must be exactly 6 characters long.',
        'any.required': 'OTP code is required.'
    })
});

const sendMoneySchema = Joi.object({
    key: Joi.string().length(56).required().messages({
        'string.base': 'Key must be a text string.',
        'string.empty': 'Key cannot be empty.',
        'string.length': 'Key must be exactly 56 characters long.',
        'any.required': 'Key is required for this transaction.'
    }),

    amount: Joi.number().positive().required().messages({
        'number.base': 'Amount must be a valid number.',
        'number.positive': 'Amount must be greater than zero.',
        'any.required': 'Amount is required to send money.'
    })
});

module.exports = {
    createCustomerSchema,
    loginCustomerSchema,
    sendOtpSchema,
    sendMoneySchema
};