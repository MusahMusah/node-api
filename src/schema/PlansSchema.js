const mongoose = require('mongoose');

const plansSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    planId: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Plans', plansSchema);
