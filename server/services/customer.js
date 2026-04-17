const CustomerModel = require("../models/customer");
const nodemailer = require("nodemailer");
const { Keypair, TransactionBuilder, Operation, Networks } = require("diamante-base");
const { Horizon, Asset } = require("diamante-sdk-js");

const email = "chemconupdate1@gmail.com";
const pass = "szfesegxwqlzgjqm";

const create = (postData) => CustomerModel.create(postData);
const getAll = (filter) => CustomerModel.find(filter).lean();
const getOne = (filter) => CustomerModel.findOne(filter).lean();
const getById = (id) => CustomerModel.findById(id).lean();
const updateById = (id, payload) => CustomerModel.findByIdAndUpdate(id, payload, { new: true }).lean();


const registerCustomer = async (customerData) => {
    const { name, companyEmail, walletAddress } = customerData;

    const existingUser = await getOne({ $or: [{ email: companyEmail }, { walletAddress }] });
    if (existingUser) {
        const error = new Error("A user with this email or wallet address already exists.");
        error.statusCode = 409;
        throw error;
    }

    const keypair = Keypair.random();
    const pkey = keypair.publicKey();
    const skey = keypair.secret();

    console.log(`🔑 Keypair created: Public=${pkey}`);

    try {
        const fetch = await import("node-fetch").then((mod) => mod.default);

        const response = await fetch(`https://friendbot.diamcircle.io/?addr=${pkey}`);

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error(`🔴 Friendbot refused (HTTP Status: ${response.status}). Details:`, errorDetails);

            const error = new Error("The blockchain service is temporarily unavailable (Friendbot refused).");
            error.statusCode = 502;
            throw error;
        }

        const result = await response.json();
        console.log(`✅ Account ${pkey} successfully funded and activated on the network!`);

    } catch (err) {
        if (err.statusCode) throw err;

        const error = new Error("Unable to contact the Diamante network. Check your connection.");
        error.statusCode = 503; // 503 Service Unavailable
        throw error;
    }

    const result = await response.json();
    console.log(`Account ${pkey} activated`, result);

    const payload = {
        name,
        email: companyEmail,
        walletAddress,
        type: "user",
        pkey,
        skey,
    };

    return await create(payload);
};

const login = async (walletAddress) => {
    const user = await getOne({ walletAddress });
    if (!user) {
        const error = new Error("Wallet address not found. Please sign up first.");
        error.statusCode = 404; // Hardening - 404 Not Found
        throw error;
    }
    return user;
};

const sendOtpEmail = async (userEmail, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: { user: email, pass: pass },
            tls: { rejectUnauthorized: false },
        });

        const mailOptions = {
            from: email,
            to: userEmail,
            subject: "SupplyX Have just delivered your OTP!",
            html: `
            <body>
                <h3 style="font-family:Sans-Serif;color:#190482;">
                   Your OTP IS: ${otp},<br/><br/>
                   If you did not request this OTP, please ignore this email and do not share the OTP with anybody else.
                </h3>
            </body>`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
        return true;
    } catch (err) {
        console.error("Error sending OTP:", err);
        throw new Error("Unable to send OTP email");
    }
};

const fetchBalance = async (pkey) => {
    const server = new Horizon.Server("https://diamtestnet.diamcircle.io/");
    const account = await server.loadAccount(pkey);

    // Bug fix: Extract balances into an array cleanly
    const balances = account.balances.map(balance => ({
        type: balance.asset_type,
        balance: balance.balance
    }));

    return balances;
};

const processPayment = async (destinationKey, amount = "1") => {
    // ⚠️ In production, this secret MUST be in the .env file
    const senderSecret = "SBBXMWUSGQDDH73N3NICSCFH3B5NQA3QF6PZ7KRIZPNFIOCE7JI4NGZ3";

    const server = new Horizon.Server("https://diamtestnet.diamcircle.io/");
    const senderKeypair = Keypair.fromSecret(senderSecret);
    const senderPublicKey = senderKeypair.publicKey();

    const account = await server.loadAccount(senderPublicKey);
    const transaction = new TransactionBuilder(account, {
        fee: await server.fetchBaseFee(),
        networkPassphrase: Networks.TESTNET,
    })
        .addOperation(
            Operation.payment({
                destination: destinationKey,
                asset: Asset.native(),
                amount: amount,
            })
        )
        .setTimeout(30)
        .build();

    transaction.sign(senderKeypair);
    await server.submitTransaction(transaction);

    return { sender: senderPublicKey, destination: destinationKey, amount };
};

const CustomerService = {
    create,
    getAll,
    getOne,
    getById,
    updateById,
    registerCustomer,
    login,
    sendOtpEmail,
    fetchBalance,
    processPayment
};

module.exports = CustomerService;