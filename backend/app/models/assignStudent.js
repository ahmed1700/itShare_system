const mongoose = require('mongoose');
const Joi = require('joi');
const AutoIncrement = require('mongoose-sequence')(mongoose);
//بسجل الطالب في كورس معين وجروب معين ومش شرط اول ما اسجله اسجل معاه الجروب 
const assignStudentSchema = new mongoose.Schema({
    branchID: {
        type: mongoose.Schema.Types.Number,
        ref: 'branch',
        required: true,
        trim: true
    },
    employeeID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Employee',
        required: true,
        trim: true
    },

    studentID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Student',
        required: true,
        trim: true,
    },
    groupID: {
        type: mongoose.Schema.Types.Number,
        ref: 'groups',
        trim: true
    },
    courseID: {
        type: mongoose.Schema.Types.Number,
        ref: 'courses',
        required: true,
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
    status: {
        type: String,
        enum: ['waiting', 'pending', 'working', 'finished'],
        trim: true
    },
    totalPayment: {
        type: Number,
        required: true,
    },
    isUpdated: {
        type: Boolean,
        default: false
    },
    attend: {
        type: Boolean,
        default: false
    },
    creationDate: {
        type: Date,
        default: new Date(),
        trim: true,
        required: true,
    }
}).plugin(AutoIncrement, { inc_field: 'assignStudentID' });

const assignStudent = mongoose.model('assignStudent', assignStudentSchema);

function validateassignStudent(assignStudent) {
    const schema = Joi.object()
        .keys({
            branchID: Joi.number().required(),
            employeeID: Joi.number().required(),
            studentID: Joi.number().required(),
            groupID: Joi.number(),
            courseID: Joi.number().required(),
            courseTracks: Joi.array()
                .items(Joi.object({ 
                    trackID: Joi.number()
                        .required()
                        .integer()
                        .positive(),
                })),
            totalPayment: Joi.number(),
            status: Joi.string()
        });
    return Joi.validate(assignStudent, schema);
}
exports.AssignStudent = assignStudent;
exports.validate = validateassignStudent;