const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Joi = require('joi');

const vacationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        trim: true,
        required: true,
        unique: true
    },
    indexDay: {
        type: Number,
        trim: true,
        required: true
    }
}).plugin(AutoIncrement, { inc_field: 'vacationID' });

const Vacation = mongoose.model('vacations', vacationSchema);

function validateVacation(Vacation) {
    const Schema = Joi.object().keys({
        title: Joi.string().required(),
        date: Joi.date(),
        indexDay: Joi.number()

    });
    return Joi.validate(Vacation, Schema);
};

exports.Vacation = Vacation;
exports.validate = validateVacation;

