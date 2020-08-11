const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Joi = require('joi');

// create group schema

const trackSchema = new mongoose.Schema({
    trackName: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    trackHours: {
        type: Number,
        required: true,
        trim: true,
    },
    trackOutline: {
        type: String,
        required: true,
        trim: true, 
    },
    price: {
        type: Number,
        required: true,
        trim: true
    }, 
    creationDate: {
        type: Date,
        default: new Date(),
        trim: true,
        required: true,
    },

}).plugin(AutoIncrement, { inc_field: 'trackID' });


const Track = mongoose.model('Track', trackSchema);



function validateTrack(track) {
    const schema = Joi.object()
        .keys({        
          trackName: Joi.string().required().trim(),
           trackHours: Joi.number().required(),
            price: Joi.number().required(),
            trackOutline: Joi.string().required().trim()
        });
    return Joi.validate(track, schema);
}
exports.Track = Track;
exports.validate = validateTrack;
exports.trackSchema  = trackSchema ;