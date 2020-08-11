const mongoose = require('mongoose');
const Joi = require('joi');
const AutoIncrement = require('mongoose-sequence')(mongoose);


// create the schema category 
const categorySchema = new mongoose.Schema({
    employeeID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Employee',
        required: true,
        trim: true,
    },
    categoryName: {
        type: String,
        required: true,
        unique: true
    },
    creationDate: {
        type: Date,
        default: new Date(),
        trim: true,
        required: true,
    },
}).plugin(AutoIncrement, { inc_field: 'categoryID' });



// create the student class into DB
const category = mongoose.model('category', categorySchema);

function validationCategory(category) {

    const schema = Joi.object()
        .keys({
            employeeID: Joi.number().required(),
            categoryName: Joi.string().required(),
        });
    return Joi.validate(category, schema);
}

exports.Category = category;
exports.Validate = validationCategory;
exports.categorySchema = categorySchema;
