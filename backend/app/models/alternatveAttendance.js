const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Joi = require('joi');

//دي كده الجدول اللي الادمن بيسجل فيه المحاضرات المؤجله علشان لو المدرب قرر مره ياجل محاضره ليوم
//غير الايام الموجوده في جدول الجروب 
const alternativeAttendantSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
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
    },  // بحط التراك في حالة اذا كان الحروب له تراكات وبحط الكورس في حالة اذا كان الجروب ملوش تراكات 

    HourFrom: {
        type: String,
        required: true,
    },
    HourTo: {
        type: String,
        required: true,
    },
    class: {
        type: String,
        enum: ['lab1', 'lab2', 'lab3', 'lab4', 'lab5', 'lab6', 'lab7',],
        trim: true
    },
}).plugin(AutoIncrement, { inc_field: 'alternativeAttendantID' });

const AlternativeAttendant = mongoose.model('alternativeAttendant', alternativeAttendantSchema);

function validatealternativeAttendant(AlternativeAttendant) {
    const Schema = Joi.object().keys({
        date: Joi.date().required(),
        groupID: Joi.number().required(),
        trainerID: Joi.number().required(),
        trackID: Joi.number().required(),
        HourFrom: Joi.string().required(),
        HourTo: Joi.string().required(),
        class: Joi.string(),
    });
    return Joi.validate(AlternativeAttendant, Schema);
};

exports.AlternativeAttendant = AlternativeAttendant;
exports.validate = validatealternativeAttendant;

