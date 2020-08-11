const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Joi = require('joi');

const teacheingAttendantSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: new Date(),
        required: true
    }, 
    signin: {
        type: String,

    },
    signOut: {
        type: String,
    },
    actualTeachedHours: {
        type: Number,
    },
    totalTeachedHours: { 
        type: Number,
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
    },
    
    ip: {
        type: String,
        required: true,
    },
}).plugin(AutoIncrement, { inc_field: 'teacheingAttendantID' });

const TeacheingAttendant = mongoose.model('teacheingAttendant', teacheingAttendantSchema);

function validateteacheingAttendant(TeacheingAttendant) {
    const Schema = Joi.object().keys({
        date: Joi.date(),
        signin: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
        signOut: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
        actualTeachedHours: Joi.number(),
        totalTeachedHours: Joi.number(),
        groupID: Joi.number().required(),
        trainerID: Joi.number().required(),
        trackID: Joi.number(),
        ip: Joi.string().required(),
    });
    return Joi.validate(TeacheingAttendant, Schema);
};

exports.TeacheingAttendant = TeacheingAttendant;
exports.validate = validateteacheingAttendant;

