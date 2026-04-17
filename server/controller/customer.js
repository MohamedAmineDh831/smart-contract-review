const { wrapAsync } = require("../lib/wrapAsync");
const CustomerService = require("../services/customer");

const createCustomer = async (req, res) => {
    const newCustomer = await CustomerService.registerCustomer(req.body);

    res.status(201).json({
        success: true,
        message: "Signup successful!",
        data: newCustomer
    });
};

const getBalance = async (req, res) => {
    const { pkey } = req.query;
    const balances = await CustomerService.fetchBalance(pkey);

    res.status(200).json({
        success: true,
        data: balances
    });
};

const sendMoney = async (req, res) => {
    const { key, amount } = req.body;
    const paymentData = await CustomerService.processPayment(key, amount);

    res.status(200).json({
        success: true,
        message: `Payment of ${paymentData.amount} DIAM made to ${paymentData.destination} successfully`,
        data: paymentData
    });
};

const getAll = async (req, res) => {
    const customers = await CustomerService.getAll();

    res.status(200).json({
        success: true,
        data: customers
    });
};

const sendOtp = async (req, res) => {
    const { email, otp } = req.body;
    await CustomerService.sendOtpEmail(email, otp);

    res.status(200).json({
        success: true,
        message: "OTP sent successfully!"
    });
};

const loginCustomer = async (req, res) => {
    const { walletAddress } = req.body;
    const user = await CustomerService.login(walletAddress);

    res.status(200).json({
        success: true,
        message: "Login successful!",
        user
    });
};

const CustomerController = {
  createCustomer: wrapAsync(createCustomer),
  loginCustomer: wrapAsync(loginCustomer),
  sendOtp: wrapAsync(sendOtp),
  sendMoney: wrapAsync(sendMoney),
  getBalance: wrapAsync(getBalance),
  getAll: wrapAsync(getAll),
};

module.exports = CustomerController;
