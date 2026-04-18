const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');

let mongoServer;

jest.setTimeout(15000);

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe('Question Integration Tests', () => {


    describe('POST /api/questions', () => {

        it('[SUCCESS] should create a new question set successfully', async () => {
            const newQuestionSet = {
                productName: "SupplyX Pro",
                productDescription: "High-end logistics tracker",
                productImageUrl: "https://example.com/product.png",
                isOrderIdTracking: true,
                reviewDate: new Date().toISOString(),
                questions: [
                    {
                        type: "MCQ",
                        q: "How do you find the product?",
                        options: ["Excellent", "Bien", "Passable"]
                    }
                ]
            };

            const res = await request(app)
                .post('/api/questions')
                .send(newQuestionSet);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.productName).toBe(newQuestionSet.productName);
        });

        it('[ERROR] should return 422 if required fields are missing', async () => {
            const invalidData = {
                isOrderIdTracking: false
            };

            const res = await request(app).post('/api/questions').send(invalidData);

            expect(res.statusCode).toBe(422);
            expect(res.body.success).toBe(false);
        });

        it('[ERROR] should return 422 if reviewDate is missing while order tracking is enabled', async () => {
            const invalidData = {
                productName: "SupplyX Pro",
                productDescription: "Desc",
                productImageUrl: "http://img.com",
                isOrderIdTracking: true,
                questions: []
            };

            const res = await request(app).post('/api/questions').send(invalidData);

            expect(res.statusCode).toBe(422);
            expect(res.body.success).toBe(false);
        });

        it('[ERROR] should return 422 if a question type is invalid', async () => {
            const invalidData = {
                productName: "SupplyX Pro",
                productDescription: "Desc",
                productImageUrl: "http://img.com",
                isOrderIdTracking: false,
                questions: [
                    {
                        type: "RANDOM_TYPE",
                        q: "Invalid question?"
                    }
                ]
            };

            const res = await request(app).post('/api/questions').send(invalidData);

            expect(res.statusCode).toBe(422);
            expect(res.body.success).toBe(false);
        });
    });


    describe('GET /api/questions/:id', () => {

        it('[SUCCESS] should fetch a question set by ID', async () => {
            const tempQuestion = await request(app)
                .post('/api/questions')
                .send({
                    productName: "Test Search",
                    productDescription: "Desc",
                    productImageUrl: "http://img.com",
                    isOrderIdTracking: true,
                    reviewDate: new Date().toISOString(),
                    questions: [
                        {
                            type: "SHORT",
                            q: "Any additional comments?"
                        }
                    ]
                });

            const questionId = tempQuestion.body.data._id;

            const res = await request(app).get(`/api/questions/${questionId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);

            expect(res.body.data.isOrderIdTracking).toBe(true);
            expect(Array.isArray(res.body.data.questions)).toBe(true);
            expect(res.body.data.questions[0].q).toBe("Une remarque supplémentaire ?");
        });

        it('[ERROR] should return 404 if question set does not exist', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const res = await request(app).get(`/api/questions/${fakeId}`);

            expect(res.statusCode).toBe(404);
        });
    });
});