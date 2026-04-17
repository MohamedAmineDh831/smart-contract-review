const Router = require('express').Router;
const CustomerController = require('../controller/customer');
const { createCustomer, loginCustomer, sendOtp, getBalance, sendMoney, getAll } = require('../controller/customer');
const validate = require('../middlewares/validate');
const { authLimiter } = require('../middlewares/rateLimiter');
const {
    createCustomerSchema,
    loginCustomerSchema,
    sendOtpSchema,
    sendMoneySchema
} = require('../validations/customer');

const router = Router();

router.post('/create', authLimiter, validate(createCustomerSchema), createCustomer);
router.post('/login', authLimiter, validate(loginCustomerSchema), loginCustomer);
router.post('/sendotp', authLimiter, validate(sendOtpSchema), sendOtp);
router.post('/sendmoney', authLimiter, validate(sendMoneySchema), sendMoney);

router.get('/getbalance', authLimiter, getBalance);
router.get('/getall', authLimiter, getAll);

module.exports = router;
