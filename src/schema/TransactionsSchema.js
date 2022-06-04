const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Transactions', schema);
