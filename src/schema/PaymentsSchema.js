const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    user: {
        type: String,
        ref: 'User',
        required: true
    },
    planId: {
        type: String,
        required: true
    },
    txnId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'cad',
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'intent'
    },
    paymentMethod: {
        type: String,
        required: false
    },
    cardType: {
        type: String,
        default: null,
        required: false
    },
    cardNumber: {
        type: String,
        default: null,
        required: false
    },
    errorMessage:{
        type: String,
        default: null,
        required: false
    }
}, {timestamps: true});

module.exports = mongoose.model('Payments', schema);
