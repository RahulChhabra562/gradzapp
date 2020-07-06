const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Course =  new Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution'
    },

    category: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    subcategory: {
        type: mongoose.Schema.Types.String,  
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', Course);