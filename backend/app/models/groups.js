const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Joi = require('joi');

// create group schema

const groupSchema = new mongoose.Schema({
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
    groupName: {
        type: String,
        trim: true,
        minlength: 1,
        maxlength: 255,
    },
    courseID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Course',
        required: true,
        trim: true,
    },
    groupTracks: {
        type: [{
            trackID: {
                type: mongoose.Schema.Types.Number,
                required: true,
                ref: 'Track',
                trim: true,
            },
            trackStartDate: {
                type: Date,
                trim: true,
            },
            trackEndDate: {
                type: Date,
                trim: true,
            },
            trackHistory: {
                type: Array
            },
            trainerID: {
                type: mongoose.Schema.Types.Number,
                ref: 'Trainer',
                trim: true,
            },
            trainerPricePerHour: {
                type: Number,
                required: true,
            },
            isPaid: {
                type: Boolean,
                default: false,
            },
            trackStatus: {
                type: String,
                enum: ['waiting', 'pending', 'working', 'completed'],
                trim: true
            },
            totalTeachedHours: {
                type: Number,
                default: 0,
            },
            trainerTotalTeachedHours: {
                type: Number,
                default: 0,
            }
        }],
        trim: true,
        required: true
    },
    groupSchedule: {
        type: [{
            days: {
                type: String,
                required: true,
            },
            Hourfrom: {
                type: String,
                required: true,
            },
            Hourto: {
                type: String,
                required: true,
            },
        }],
        required: true,
        trim: true,
    },
    groupStartDate: {
        type: Date,
        required: true,
        trim: true,
    },
    groupEndDate: {
        type: Date,
        trim: true,
    },
    class: {
        type: String,
        enum: ['lab1', 'lab2', 'lab3', 'lab4', 'lab5', 'lab6', 'lab7',],
        trim: true
    },
    groupType: {
        type: String,
        enum: ['ClassRoom', 'Online'],
        trim: true
    },
    groupStatus: {
        type: String,
        enum: ['waiting', 'pending', 'working', 'completed'],
        trim: true
    },

    cousreHistory: {
        type: Array
    },
    creationDate: {
        type: Date,
        default: new Date(),
        trim: true,
        required: true,
    },
}).plugin(AutoIncrement, { inc_field: 'groupID' });


const Group = mongoose.model('groups', groupSchema);

// Group.groupEndDate(26,1);

function validateGroup(group) {
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
            groupName: Joi.string()
                .trim(),
            courseID: Joi.number()
                .required()
                .integer()
                .positive(),
            groupSchedule: Joi.array()
                .items(Joi.object({
                    days: Joi.string().required(),
                    Hourfrom: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
                    Hourto: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
                }))
                .required(),
            groupTracks: Joi.array().items
                (Joi.object({
                    trackID: Joi.number(),
                    trackStartDate: Joi.date(),
                    trackEndDate: Joi.date(),
                    trackHistory: Joi.array(),
                    trainerID: Joi.number(),
                    trainerPricePerHour: Joi.number(),
                })),
            groupStartDate: Joi.date().required(),
            groupEndDate: Joi.date(),
            class: Joi.string().trim(),
            groupType: Joi.string().required().trim(),
            groupStatus: Joi.string().required().trim(),
            courseHistory: Joi.array(),
        });
    return Joi.validate(group, schema);
}
exports.Group = Group;
exports.validate = validateGroup;
exports.groupSchema = groupSchema;