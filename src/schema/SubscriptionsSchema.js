const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isSubscribed: {
        type: Boolean,
        required: true
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true,
    },
    isExpiredOn: {
        type: String,
        required: true
    },
    autoRenew: {
        type: Boolean,
        required: true,
        default: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Subscriptions', schema);
