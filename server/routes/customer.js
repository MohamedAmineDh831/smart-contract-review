const Router = require('express').Router;
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

/**
 * @openapi
 * /customers/create:
 *   post:
 *     tags:
 *       - Customers
 *     summary: Full customer registration and Blockchain activation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Mohamed"
 *               companyEmail:
 *                 type: string
 *                 example: "mohamed@test.com"
 *               walletAddress:
 *                 type: string
 *                 example: "GD67...EXAMPLE"
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       409:
 *         description: Conflict - Email or Wallet already exists
 */
router.post('/create', authLimiter, validate(createCustomerSchema), createCustomer);

/**
 * @openapi
 * /customers/login:
 *   post:
 *     tags:
 *       - Customers
 *     summary: Login via Wallet Address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletAddress:
 *                 type: string
 *                 example: "GD67...EXAMPLE"
 *     responses:
 *       200:
 *         description: Login successful
 *       404:
 *         description: Wallet not found
 */
router.post('/login', authLimiter, validate(loginCustomerSchema), loginCustomer);

/**
 * @openapi
 * /customers/sendotp:
 *   post:
 *     tags:
 *       - Customers
 *     summary: Send OTP code via email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post('/sendotp', authLimiter, validate(sendOtpSchema), sendOtp);

/**
 * @openapi
 * /customers/sendmoney:
 *   post:
 *     tags:
 *       - Customers
 *     summary: Send DIAM (Blockchain Payment)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               amount:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment successful
 */
router.post('/sendmoney', authLimiter, validate(sendMoneySchema), sendMoney);

/**
 * @openapi
 * /customers/getbalance:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Check Blockchain account balance
 *     parameters:
 *       - in: query
 *         name: pkey
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getbalance', authLimiter, getBalance);

/**
 * @openapi
 * /customers/getall:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Get all customers from database
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getall', authLimiter, getAll);

module.exports = router;