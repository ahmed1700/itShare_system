const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Joi = require('joi');

// create group schema
const examSchema = new mongoose.Schema({
    employeeID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Employee',
        required: true,
        trim: true,
    },
    providerID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Provider',
        required: true,
        trim: true,
    },
    examName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    examCode: {
        type: String,
        trim: true,
        required: true,
    },
    examPrice: {
        type: Number,
        trim: true,
        required: true,
    },
    examCurrentPrice: {
        type: Number,
        trim: true,
        required: true,
    },
    creationDate: {
        type: Date,
        default: new Date(),
        trim: true,
        required: true,
    },
}).plugin(AutoIncrement, { inc_field: 'examID' });

const exam = mongoose.model('exams', examSchema);

function validateExam(exam) {
    const schema = Joi.object()
        .keys({
            employeeID: Joi.number()
                .required()
                .integer()
                .positive(),
            providerID: Joi.number()
                .required()
                .integer()
                .positive(),
            examName: Joi.string()
                .required()
                .trim(),
            examCode: Joi.string()
                .required(),
            examPrice: Joi.number().required(),
            examCurrentPrice: Joi.number().required()
        });

    return Joi.validate(exam, schema);
}

exports.Exam = exam;
exports.Validate = validateExam;
exports.examSchema = examSchema; 
