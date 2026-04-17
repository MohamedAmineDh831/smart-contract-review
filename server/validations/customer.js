const Joi = require('joi');

const createCustomerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().trim(),
    companyEmail: Joi.string().email().required().trim(),
    walletAddress: Joi.string().length(56).pattern(/^G/).required().messages({
        'string.pattern.base': 'Le walletAddress doit être une adresse publique valide commençant par G.'
    })
});

const loginCustomerSchema = Joi.object({
    walletAddress: Joi.string().required().trim()
});

const sendOtpSchema = Joi.object({
    email: Joi.string().email().required().trim(),
    otp: Joi.string().length(6).required()
});

const sendMoneySchema = Joi.object({
    key: Joi.string().length(56).required(),
    amount: Joi.number().positive().required()
});

module.exports = {
    createCustomerSchema,
    loginCustomerSchema,
    sendOtpSchema,
    sendMoneySchema
};