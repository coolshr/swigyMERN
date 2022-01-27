const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendorSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    managerName: {
        type: String,
        required: true
    },
    shopName: {
        type: String,
        required: true,
        unique: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    openingTime: {
        type: Date,
        required: true
    },
    closingTime: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = Vendor = mongoose.model('vendor', vendorSchema);