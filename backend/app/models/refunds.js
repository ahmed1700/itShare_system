const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Joi = require('joi');

// create the schema for refunds
const refundSchema = new mongoose.Schema({
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
        max: 5000
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
        trim: true,
        enum: ['in', 'out']
    },
    paymentType: {
        type: String,
        trim: true,
        enum: ['Cash', 'Visa', 'Fawry', 'BankTransfar', 'VodaphonCash', 'PayPal']
    },
    branchID: {
        type: mongoose.Schema.Types.Number,
        ref: 'branch',
        trim: true
    },
    assignStudentID: {
        type: mongoose.Schema.Types.Number,
        ref: 'assignStudent',
        required: true,
        trim: true
    },
     comment:{
         type:String
     },
    creationDate: {
        type: Date,
        default: new Date(),
    },

    status: {
        type: String,
        enum: ['waiting', 'refused', 'agree'],
        default: 'waiting'
    }



}).plugin(AutoIncrement, { inc_field: 'refundID' });

const refund = mongoose.model('refunds', refundSchema);

function validaterefund(refund) {
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
            branchID: Joi.number(),
            assignStudentID: Joi.number().required(),
            paid: Joi.number()
                .integer()
                .required()
                .min(1)
                .max(5000),
            tranactionType: Joi.string(),
                
            paymentType: Joi.string(),
            remaing: Joi.number()
                .integer()
                .min(1)
                .max(5000),
        });
    return Joi.validate(refund, schema);
}

exports.refund = refund;
exports.validate = validaterefund;
