const mongoose = require('mongoose');
const Joi = require('joi');
const cities = require('full-countries-cities').getCities('egypt'); // Returns an array of city names of the particular country.
const AutoIncrement = require('mongoose-sequence')(mongoose);
const validator = require('validator');
var uniqueValidator = require('mongoose-unique-validator');


// create the schema employees 
const employeesSchema = new mongoose.Schema({
    branchID: {
        type: mongoose.Schema.Types.Number,
        ref: 'branch',
        required: true,
        trim: true
    },
    fullNameArabic: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255,
        minlength: 3,
    },
    fullNameEnglish: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255,
        minlength: 3,
        lowercase: true,
    },
    nationalID: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 14,
    },
    homeTel: {
        type: String,
        trim: true,
        unique: true,
        maxlength: 12,
    },
    mobile1: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 11,
        validate: {
            validator: value => validator.isMobilePhone(value, 'ar-EG'),
            message: 'the mobile1 is not correct',
        },
    },
    mobile2: {
        type: String,
        trim: true,
        unique: true,
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
        unique: true,
        maxlength: 255,
        minlength: 3,
        validate: {
            validator: value => validator.isEmail(value),
            message: 'the email is not correct',
        },
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female'],
        lowercase: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        enum: cities,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255,
        minlength: 5,
        lowercase: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'Manager'],
        default: 'Manager',
    },
    status: {
        type: String,
        enum: ['active', 'deactive'],
        lowercase: true,
        default: 'active',
        trim: true,
    },
    salary: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
        minlength: 4,
        maxlength: 1024,
    },
    ip: {
        type: String,
    },
    creationDate: {
        type: Date,
        default: new Date(),
        trim: true,
        required: true,
    },
}).plugin(AutoIncrement, { inc_field: 'employeeID' }, uniqueValidator);



// create the student class into DB
const Employee = mongoose.model('employees', employeesSchema);

function validationEmployee(employee) {

    const schema = Joi.object()
        .keys({
            branchID: Joi.number().required(),
            fullNameArabic: Joi.string()
                .required()
                .max(255)
                .min(3)
                .trim(),
            fullNameEnglish: Joi.string()
                .required()
                .max(255)
                .min(3)
                .trim(),
            nationalID: Joi.string()
                .regex(/^([0-9]*)$/, { name: 'numbers' })
                .length(14)
                .required()
                .trim(),
            homeTel: Joi.string()
                .regex(/^([0-9]*)$/, { name: 'numbers' })
                .length(10)
                .trim(),
            mobile1: Joi.string()
                .length(11)
                .regex(/^([0-9]*)$/, { name: 'numbers' })
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
            gender: Joi.string()
                .required()
                .lowercase()
                .only(['male', 'female'])
                .trim(),
            city: Joi.string()
                .required()
                .only(cities)
                .trim(),
            address: Joi.string()
                .required()
                .max(255)
                .min(5)
                .trim(),
            role: Joi.string(),
            status: Joi.string()
                .lowercase()
                .only(['active', 'deactive'])
                .trim(),
            salary: Joi.string().required().regex(/^([0-9]*)$/, { name: 'numbers' }),
            password: Joi.string()
                .regex(/^([a-z0-9A-Z]*)$/),
            ip: Joi.string(),
        });
    return Joi.validate(employee, schema);
}

exports.Employee = Employee;
exports.validate = validationEmployee;
exports.employeesSchema = employeesSchema;
