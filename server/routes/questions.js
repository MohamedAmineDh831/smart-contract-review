const express = require("express");
const QuestionController = require("../controller/question");
const router = express.Router();

const {authLimiter} = require("../middlewares/rateLimiter");
const validate = require("../middlewares/validate");
const {createQuestionSchema} = require("../validations/question");

router.post("/", authLimiter, validate(createQuestionSchema), QuestionController.create);
router.get("/:id", authLimiter, QuestionController.getById);

module.exports = router;
