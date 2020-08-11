const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Joi = require('joi');

// create the schema for transfers
const transferSchema = new mongoose.Schema({
    employeeID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Employee',
        required: true,
        trim: true,
    },
    groupID: {
        type: mongoose.Schema.Types.Number,
        ref: 'groups',
        trim: true
    },
    courseTracks: {
        type: [{
            trackID: {
                type: mongoose.Schema.Types.Number,
                ref: 'tracks',
            },
        }],
        trim: true,
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

    oldCourseID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Course',
        required: true,
        trim: true,
    },
    newCourseID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Course',
        required: true,
        trim: true,
    },
    newTotalPayment: {
        type: Number,
        required: true
    },
    paid: {
        type: Number,
    },
    comment:{
         type:String
    },
    creationDate: {
        type: Date,
        default: new Date(new Date()),
        trim: true,
        required: true,
    },



}).plugin(AutoIncrement, { inc_field: 'transferID' });

const Transfer = mongoose.model('transfers', transferSchema);

function validatetransfer(transfer) {
    const schema = Joi.object()
        .keys({
            employeeID: Joi.number()
                .required()
                .integer()
                .positive(),
            oldCourseID: Joi.number()
                .required()
                .integer()
                .positive(),
            newCourseID: Joi.number()
                .required()
                .integer()
                .positive(),
            branchID: Joi.number().required(),
            assignStudentID: Joi.number().required(),
            newTotalPayment: Joi.number().required(),
            paid: Joi.number(),
            courseTracks: Joi.array()
                .items(Joi.object({
                    trackID: Joi.number()
                        .required()
                        .integer()
                        .positive(),
                })),
            groupID: Joi.number(),

        });
    return Joi.validate(transfer, schema);
}

exports.Transfer = Transfer;
exports.validate = validatetransfer;
