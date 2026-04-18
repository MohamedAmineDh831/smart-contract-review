require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const CustomerService = require('../services/customer');

jest.setTimeout(15000);
let mongoServer;

describe('Customer Integration Tests', () => {

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        await mongoose.connect(uri);
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    afterAll(async () => {
        await mongoose.connection.close();
        jest.restoreAllMocks();
    });

    describe('POST /api/customers/create', () => {
        it('should create a new customer and return 201', async () => {

            jest.spyOn(CustomerService, 'registerCustomer').mockResolvedValue({
                pkey: "G" + "A".repeat(55),
                skey: "S" + "B".repeat(55)
            });

            const res = await request(app)
                .post('/api/customers/create')
                .send({
                    name: "Test User",
                    companyEmail: `test${Date.now()}@gmail.com`,
                    walletAddress: "G" + "A".repeat(55)
                });

            if (res.statusCode !== 201) {
                console.log('Failing Body:', res.body);
            }

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
        });
    });
});