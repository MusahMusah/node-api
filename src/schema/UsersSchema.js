const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false,
        default: null,
        unique: true,
        min: 16,
        max: 16
    },
    image: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default: 'active'
    },
    email_verify_at: {
      type: Date,
      default: null
    },
    role: {
        type: String,
        default: 'user'
    },
    security:{
        tokens: [{
            refreshToken: String,
            createdAt: Date
        }],
        accountVerification: {
          otp: {
            type: String,
            default: null
          },
          otp_expiry: {
            type: Number,
            default: null
          },
        },
        passwordResetToken: {
            otp: {
                type: String,
                default: null
            },
            reset: {
                type: Boolean,
                default: false
            },
            expiry: {
                type: Date,
                default: null
            }
        },
    }
}, {timestamps: true});

module.exports = mongoose.model('User', usersSchema);
