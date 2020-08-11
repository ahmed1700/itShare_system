const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Joi = require('joi');

const studentAttendantSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: new Date(), 
        required: true
    }, 
    totalTeachedHours: { 
        type: Number,
    },
    assignStudentID: {
        type: mongoose.Schema.Types.Number,
        ref: 'assignStudent',
      //  required: true, 
        trim: true
    },
    groupID: {
        type: mongoose.Schema.Types.Number,
        ref: 'groups',
      //  required: true,
        trim: true
    },
    trackID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Track',
        trim: true,
    },
    ip: {
        type: String,
       // required: true,
    },
}).plugin(AutoIncrement, { inc_field: 'studentAttendantID' });

const studentAttendant = mongoose.model('studentAttendant', studentAttendantSchema);

function validateStudentAttendant(studentAttendant) {
    const Schema = Joi.object().keys({
        date: Joi.date(),
        totalTeachedHours: Joi.number(),
        assignStudentID: Joi.number(),
        groupID: Joi.number(),
        trackID: Joi.number(),
        ip: Joi.string(),
    });
    return Joi.validate(studentAttendant, Schema);
};

exports.studentAttendant = studentAttendant;
exports.validate = validateStudentAttendant;

