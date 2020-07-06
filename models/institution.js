const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Institution = new Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    country: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    imageurl: {
        type: mongoose.Schema.Types.String,
        required: true
    }

},{
    timestamps: true
});

module.exports = mongoose.model('Institution', Institution);