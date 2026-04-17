const QuestionSetModel = require("../models/question");

const create = (postData) => QuestionSetModel.create(postData);
const getAll = (filter) => QuestionSetModel.find(filter).lean();
const getOne = (filter) => QuestionSetModel.findOne(filter).lean();
const getById = (id) => QuestionSetModel.findById(id).lean();
const updateById = (id, payload) => QuestionSetModel.findByIdAndUpdate(id, payload, { new: true }).lean();


const createQuestionSet = async (data) => {
    const payload = {
        productName: data.productName,
        productDescription: data.productDescription,
        productImageUrl: data.productImageUrl,
        isOrderIdTracking: data.isOrderIdTracking,
        reviewDate: data.isOrderIdTracking ? data.reviewDate : null,
        excelFile: !data.isOrderIdTracking ? data.excelFile : null,
        questions: data.questions,
    };

    return await create(payload);
};

const getQuestionSetById = async (id) => {
    const questionSet = await getById(id);

    if (!questionSet) {
        const error = new Error("Questions not found");
        error.statusCode = 404;
        throw error;
    }

    return questionSet;
};

const QuestionService = {
    create,
    getAll,
    getOne,
    getById,
    updateById,
    createQuestionSet,
    getQuestionSetById,
};

module.exports = QuestionService;