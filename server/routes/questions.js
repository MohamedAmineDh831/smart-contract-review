const express = require("express");
const QuestionController = require("../controller/question");
const router = express.Router();

const {authLimiter} = require("../middlewares/rateLimiter");
const validate = require("../middlewares/validate");
const {createQuestionSchema} = require("../validations/question");

/**
 * @openapi
 * /questions:
 *   post:
 *     tags:
 *       - Questions
 *     summary: Create a new question set (Form)
 *     description: Submit a new product questionnaire including image, description, and an array of custom questions.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - productDescription
 *               - productImageUrl
 *               - isOrderIdTracking
 *             properties:
 *               productName:
 *                 type: string
 *                 example: "SupplyX Pro"
 *               productDescription:
 *                 type: string
 *                 example: "High-end logistics tracker"
 *               productImageUrl:
 *                 type: string
 *                 example: "https://example.com/product.png"
 *               isOrderIdTracking:
 *                 type: boolean
 *                 example: true
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: "multiple-choice"
 *                     q:
 *                       type: string
 *                       example: "How satisfied are you?"
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Great", "Average", "Poor"]
 *     responses:
 *       201:
 *         description: Form created successfully
 *       400:
 *         description: Invalid data provided
 */
router.post("/", authLimiter, validate(createQuestionSchema), QuestionController.create);

/**
 * @openapi
 * /questions/{id}:
 *   get:
 *     tags:
 *       - Questions
 *     summary: Get a question set by ID
 *     description: Retrieve the questions and order tracking status for a specific form using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the question set (MongoDB ObjectId)
 *         example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *     responses:
 *       200:
 *         description: Success - Returns the requested questions
 *       404:
 *         description: Question set not found
 *       429:
 *         description: Too many requests
 */
router.get("/:id", authLimiter, QuestionController.getById);

module.exports = router;
