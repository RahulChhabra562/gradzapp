const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Userapplication = new Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution'
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },

    status: {
        type: mongoose.Schema.Types.String,
        required: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Userapplication', Userapplication);