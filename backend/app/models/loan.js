const mongoose = require('mongoose');
const Joi = require('joi');
const AutoIncrement = require('mongoose-sequence')(mongoose);


// create the schema loan 
const loanSchema = new mongoose.Schema({
   
    employeeID: {
        type: mongoose.Schema.Types.Number,
        ref: 'Employee',
        required: true, 
        trim: true,
    },
    branchID: {
        type: mongoose.Schema.Types.Number,
        ref: 'branch',
        trim: true
    },
    loanValue:{
        type: String,
    },

    month:{
        type: String,
    },
    
    creationDate: {
        type: Date,
        default: new Date(),
        trim: true,
        required: true,
    },
}).plugin(AutoIncrement, { inc_field: 'loanID' });



// create the student class into DB
const loan = mongoose.model('loan', loanSchema);

function validationLoan(loan) {

    const schema = Joi.object()
        .keys({
            branchID: Joi.number(),
            employeeID: Joi.number().required(),
            loanValue:Joi.string().required().regex(/^([0-9]*)$/, { name: 'numbers' }),    
        });
    return Joi.validate(loan, schema);
}

exports.Loan = loan;
exports.validate = validationLoan;
exports.loanSchema = loanSchema;
