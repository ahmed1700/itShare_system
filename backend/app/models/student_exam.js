const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Joi = require('joi');


const studentExamSchema = new mongoose.Schema({

    employeeID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Employee',
        required: true,  
        trim: true,
    },
    branchID: {
        type: mongoose.Schema.Types.Number,
        ref: 'branch',
        required: true,
        trim: true
    },
    studentID: {
        type: mongoose.Schema.Types.Number, 
        ref: 'Student',
        required: true,
        trim: true,
    },
    examID: {
        type: mongoose.Schema.Types.Number,
        ref: 'exams',
        required: true,
        trim: true
    },
    
    code:{
        type: String,
        required: true,
    },
    totalPrice:{
        type: Number,
        required: true,
    },
    originalPrice:{
        type: Number,
        required: true,
    },
    paymentType: {
        type: String,
        required: true,
        trim: true,
        enum: ['Cash', 'Visa', 'Fawry', 'BankTransfar', 'VodaphonCash', 'PayPal']
    },
    creationDate: {
        type: Date,
        default: new Date(),
        trim: true,
        required: true,
    }
}).plugin(AutoIncrement, { inc_field: 'studentExamID' });

const studentExam = mongoose.model('studentExam', studentExamSchema);

function validatestudentExam(studentExam) {
    const Schema = Joi.object().keys({
        employeeID: Joi.number()
                .required()
                .integer()
                .positive(),
        branchID: Joi.number().required(),        
        studentID: Joi.number().required(), 
        examID: Joi.number().required(), 
        code:Joi.string().required(),
        totalPrice:Joi.number().required(),
        originalPrice:Joi.number().required(),
        paymentType: Joi.string().required(),   
    });
    return Joi.validate(studentExam, Schema);
};

exports.StudentExam = studentExam;
exports.Validate = validatestudentExam;

