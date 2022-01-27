const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vendor = require('./vendor');

const addon = new Schema({
    addon: {
        type: String,
        required: true
    }
}, { _id: false });

const orderSchema = new Schema({
    food: {
        type: ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: ['PLACED', 'ACCEPTED', 'REJECTED', 'COOKING', 'READY FOR PICKUP', 'COMPLETED'],
        required: true,
        default: 'PLACED'
    },
    vendor: {
        type: ObjectId,
        required: true
    },
    user: {
        type: ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    addOn: [addon]
});

module.exports = Order = mongoose.model('order', orderSchema);