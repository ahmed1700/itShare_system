const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Joi = require('joi');
const validator = require('validator');

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true,
    },
    ip2: {
        type: String,
        required: true,
    },
    ip3: {
        type: String,
        required: true,
    },
    homeTel1: {
        type: String,
        trim: true,
        maxlength: 10,
    },
    homeTel2: {
        type: String,
        trim: true,
        maxlength: 10,
    },
    mobile1: {
        type: String,
        required: true,
        trim: true,
        maxlength: 11,
        validate: {
            validator: value => validator.isMobilePhone(value, 'ar-EG'),
            message: 'the mobile1 is not correct',
        },
    },
    mobile2: {
        type: String,
        trim: true,
        maxlength: 11,
        validate: {
            validator: value => validator.isMobilePhone(value, 'ar-EG'),
            message: 'the mobile2 is not correct',
        },
    },
    email: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255,
        minlength: 3,
        validate: {
            validator: value => validator.isEmail(value),
            message: 'the email is not correct',
        },
    },
    creationDate: {
        type: Date,
        default: new Date(),
        trim: true,
        required: true,
    }
}).plugin(AutoIncrement, { inc_field: 'branchID' });

const Branch = mongoose.model('branch', branchSchema);

function validateBranch(branch) {
    const Schema = Joi.object().keys({
        name: Joi.string().required(),
        address: Joi.string().required(),
        details: Joi.string().required(),
        ip: Joi.string().required(),
        ip2: Joi.string().required(),
        ip3: Joi.string().required(),
        homeTel1: Joi.string()
            .regex(/^([0-9]*)$/, { name: 'numbers' })
            .length(10)
            .trim(),
        homeTel2: Joi.string()
            .regex(/^([0-9]*)$/, { name: 'numbers' })
            .length(10)
            .trim(),
        mobile1: Joi.string()
            .regex(/^([0-9]*)$/, { name: 'numbers' })
            .length(11)
            .required()
            .trim(),
        mobile2: Joi.string()
            .regex(/^([0-9]*)$/, { name: 'numbers' })
            .length(11)
            .trim(),
        email: Joi.string()
            .required()
            .email({ minDomainAtoms: 2 })
            .trim(),
    });
    return Joi.validate(branch, Schema);
};

exports.Branch = Branch;
exports.validate = validateBranch;

