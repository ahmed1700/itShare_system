const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Joi = require('joi');

// create the schema for publicPayments
const publicPaymentSchema = new mongoose.Schema({
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
    categoryID: {
        type: mongoose.Schema.Types.Number,
        ref: 'category',
        required: true,
        trim: true
    },
    categoryDetails:{
        type:[{
            name:{
                type: String,
            },
            Quantity:{
                type: String,
            },
            price:{
                type: Number,
                min: 1,
            },
        }]
    },
    paid: {
        type: Number,
        required: true,
        trim: true,
        min: 1,
    },
    tranactionType: {
        type: String,
        required: true,
        trim: true,
        enum: ['in', 'out']
    },
    creationDate: {
        type: Date,
        default: new Date(),
        trim: true,
        required: true,
    },



}).plugin(AutoIncrement, { inc_field: 'publicPaymentID' });

const publicPayment = mongoose.model('publicPayments', publicPaymentSchema);

function validatePublicPayment(publicPayment) {
    const schema = Joi.object()
        .keys({
            employeeID: Joi.number()
                .required()
                .integer()
                .positive(),
            branchID: Joi.number()
                .required()
                .integer()
                .positive(),    
            categoryID: Joi.number()
                .required()
                .integer()
                .positive(),
          categoryDetails :Joi.array(),
            paid: Joi.number()
                .integer()
                .required()
                .min(1),
            tranactionType: Joi.string()
                .required(),
        });
    return Joi.validate(publicPayment, schema);
}

exports.publicPayment = publicPayment;
exports.validate = validatePublicPayment;
