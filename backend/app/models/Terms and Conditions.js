const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const TermsSchema = new mongoose.Schema({
   
    Terms: {
        type: String,
        required: true,  
    },
    
    creationDate: {
        type: Date,
        default:new Date(),
        trim: true,
        required: true,
    },



}).plugin(AutoIncrement, { inc_field: 'termsID' });

const Terms = mongoose.model('Terms', TermsSchema);


exports.Terms = Terms;

