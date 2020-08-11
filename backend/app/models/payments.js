const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Joi = require('joi');

// create the schema for payments
const paymentSchema = new mongoose.Schema({
    employeeID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Employee',
        required: true,
        trim: true,
    },
    totalPayment: {
        type: Number,
    },
    remaing: {
        type: Number,
    },
    paid: {
        type: Number,
        required: true,
        trim: true,
        min: 1,

    },
    studentID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Student',
        required: true,
        trim: true,
    },
    courseID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Course',
        required: true,
        trim: true,
    },
    tranactionType: {
        type: String,
        required: true,
        trim: true,
        enum: ['in', 'out']
    },
    paymentType: {
        type: String,
        required: true,
        trim: true,
        enum: ['Cash', 'Visa', 'Fawry', 'BankTransfar', 'VodaphonCash', 'PayPal']
    },
    branchID: {
        type: mongoose.Schema.Types.Number,
        ref: 'branch',
        required: true,
        trim: true
    },
    assignStudentID: {
        type: mongoose.Schema.Types.Number,
        ref: 'assignStudent',
        required: true,
        trim: true
    },
    start_date: {
        type: Date,
    },
    end_date: {
        type: Date,
    },
    comment: {
        type: String
    },

    creationDate: {
        type: Date,
        default: new Date(),
        trim: true,
        required: true,
    },



}).plugin(AutoIncrement, { inc_field: 'paymentID' });

const Payment = mongoose.model('payments', paymentSchema);

function validatePayment(payment) {
    const schema = Joi.object()
        .keys({
            employeeID: Joi.number()
                .required()
                .integer()
                .positive(),
            courseID: Joi.number()
                .required()
                .integer()
                .positive(),
            totalPayment: Joi.number()
                .integer()
                .min(1)
                .max(5000),
            start_date: Joi.date(),
            end_date: Joi.date(),
            studentID: Joi.number().required(), 
            branchID: Joi.number().required(),
            assignStudentID: Joi.number().required(),
            paid: Joi.number()
                .integer()
                .required()
                .min(1),

            tranactionType: Joi.string()
                .required(),
            paymentType: Joi.string()
                .required(),
            remaing: Joi.number()
                .integer()
                .min(1)


        });
    return Joi.validate(payment, schema);
}

exports.Payment = Payment;
exports.validate = validatePayment;
