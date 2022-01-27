const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vendor = require('./vendor');


const addOn = new Schema({
    addon: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        get: v => Math.round(v),
        set: v => Math.round(v)
    }
}, { _id: false });
const tags = new Schema({
    tag: {
        type: String,
        required: true
    }
}, { _id: false });

const orderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    vendor: {
        type: ObjectId,
        required: true
    },
    price: {
        type: Number,
        required: true,
        get: v => Math.round(v),
        set: v => Math.round(v)
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numRating: {
        type: Number,
        default: 0
    },
    veg: {
        type: Boolean,
        required: true
    },
    addons: [addOn],
    tags: [tags]
});

module.exports = Food = mongoose.model('food', orderSchema);