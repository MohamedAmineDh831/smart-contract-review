const { wrapAsync } = require("../lib/wrapAsync.js");
const QuestionService = require("../services/question.js");

const create = async (req, res) => {
    const resp = await QuestionService.createQuestionSet(req.body);

    res.status(201).json({
        success: true,
        message: "Form submitted successfully!",
        data: resp
    });
};

const getById = async (req, res) => {
    const { id } = req.params;

    const questionSet = await QuestionService.getQuestionSetById(id);

    res.status(200).json({
        success: true,
        data: {
            isOrderIdTracking: questionSet.isOrderIdTracking,
            questions: questionSet.questions,
        }
    });
};

const QuestionController = {
    create: wrapAsync(create),
    getById: wrapAsync(getById),
};

module.exports = QuestionController;