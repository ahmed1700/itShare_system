const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Joi = require('joi');

// create the schema for trainerPayments
const trainerPaymentSchema = new mongoose.Schema({
    employeeID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Employee',
        required: true,
        trim: true,
    },
    branchID: {
        type: mongoose.Schema.Types.Number,
        ref: 'branch',
        trim: true
    },
    groupID: {
        type: mongoose.Schema.Types.Number,
        ref: 'groups',
        required: true,
        trim: true
    },

    trainerID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Trainer',
        required: true,
        trim: true,
    },
    trackID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Track',
        trim: true,
        required: true,
    },

    paid: {
        type: Number,
        required: true,
        trim: true,
        min: 1,
        max: 5000
    },
    creationDate: {
        type: Date,
        default: new Date(),
        trim: true,
        required: true,
    },



}).plugin(AutoIncrement, { inc_field: 'trainerPaymentID' });

const TrainerPayment = mongoose.model('trainerPayments', trainerPaymentSchema);

function validateTrainerPayment(trainerPayment) {
    const schema = Joi.object()
        .keys({
            branchID: Joi.number(),
            employeeID: Joi.number()
                .required()
                .integer()
                .positive(),
            groupID: Joi.number()
                .required()
                .integer()
                .positive(),
            trainerID: Joi.number()
                .required()
                .integer()
                .positive(),
            trackID: Joi.number()
                .required()
                .integer()
                .positive(),
            paid: Joi.number()
                .integer()
                .required()
                .min(1)
                .max(5000),
        });
    return Joi.validate(trainerPayment, schema);
}

exports.TrainerPayment = TrainerPayment;
exports.validate = validateTrainerPayment;
