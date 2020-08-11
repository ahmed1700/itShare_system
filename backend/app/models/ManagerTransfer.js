const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Joi = require('joi');

// create the schema for mangerTransfers
const mangerTransferSchema = new mongoose.Schema({
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
    creationDate: {
        type: Date,
        default: new Date(),
        trim: true,
        required: true,
    },
    comment:{
       type:String
    },
    status: {
        type: String,
        enum: ['waiting', 'refused', 'agree'],
        default: 'waiting'
    }



}).plugin(AutoIncrement, { inc_field: 'mangerTransferID' });

const mangerTransfer = mongoose.model('mangerTransfers', mangerTransferSchema);

function validatemangerTransfer(mangerTransfer) {
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
    return Joi.validate(mangerTransfer, schema);
}

exports.mangerTransfer = mangerTransfer;
exports.validate = validatemangerTransfer;
