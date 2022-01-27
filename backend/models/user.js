const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const buyerSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    number: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true
    },
    batch: {
        type: String,
        required: true,
        enum: ['UG1', 'UG2', 'UG3', 'UG4', 'UG5'],
        required: true
    },
    password: {
        type: String,
        required: true
    },
    wallet:{
        type: Number,
        default: 0
    }
});

module.exports = Buyer = mongoose.model('user', buyerSchema);