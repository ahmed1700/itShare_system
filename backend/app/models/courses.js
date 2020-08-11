const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Joi = require('joi');

// create course schema
const courseSchema = new mongoose.Schema({
    employeeID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Employee',
        required: true,
        trim: true,
    },
    providerID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Provider',
        required: true,
        trim: true,
    },
    courseName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 255,
    },
    courseTracks: {
        type: [{
            trackID: {
                type: mongoose.Schema.Types.Number,
                ref: 'Track',
            },
        }],
        trim: true,
        required: true,
    },

    courseDesc: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
    },
    courseHours: {
        type: Number,
        trim: true,
        required: true,
    },
    coursePrice: {
        type: Number,
        trim: true,
        required: true,
    },
    discount: {
        type: Number,
        trim: true,
        required: true,
    },
    priceAfterDiscount: {
        type: Number,
        trim: true,
        required: true,
    },
    creationDate: {
        type: Date,
        default: new Date(),
        trim: true,
        required: true,
    },
}).plugin(AutoIncrement, { inc_field: 'courseID' });

const Course = mongoose.model('courses', courseSchema);

function validateCourse(course) {
    const schema = Joi.object()
        .keys({
            employeeID: Joi.number()
                .required()
                .integer()
                .positive(),
            providerID: Joi.number()
                .required()
                .integer()
                .positive(),
            courseName: Joi.string()
                .required()
                .trim()
                .min(3)
                .max(255),
            courseTracks: Joi.array()
                .items(Joi.object({
                    trackID: Joi.number()
                        .integer()
                        .positive(),
                })).required(),
            courseDesc: Joi.string()
                .required()
                .trim()
                .min(5)
                .max(255),
            courseHours: Joi.number()
                .integer()
                .required(),
            coursePrice: Joi.number()
                .required(),
            discount: Joi.number().required(),
            priceAfterDiscount: Joi.number().required(),
        });

    return Joi.validate(course, schema);
}

exports.Course = Course;
exports.validate = validateCourse;
exports.courseSchema = courseSchema;
