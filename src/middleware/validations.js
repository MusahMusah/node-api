const Joi = require('joi');

const registerationSchema = Joi.object({
    first_name: Joi.string().required().min(3).max(30),
    last_name: Joi.string().required().min(3).max(30),
    // phone: Joi.string().required().pattern(new RegExp('^[0-9]{10,16}$')),
    password: Joi.string().required().min(6).max(150),
    confirmPassword: Joi.any().equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' }),
    email: Joi.string().email().required().min(3).max(40)
})

const loginSchema = Joi.object({
    email: Joi.string().email().required().min(3).max(40),
    password: Joi.string().required().min(6).max(150)
})

const updateProfileSchema = Joi.object({
    first_name: Joi.string().required().min(3).max(30),
    last_name: Joi.string().required().min(3).max(30),
    phone: Joi.string().required().pattern(new RegExp('^[0-9]{10,16}$'))
})

const OTPSchema = Joi.object({
    otp: Joi.string().required().pattern(new RegExp('^[0-9]{6}$'))
})

const PasswordResetRequestSchema = Joi.object({
    email: Joi.string().email().required().min(3).max(50),
})

const passwordSchema = Joi.object({
    password: Joi.string().required().min(6).max(150),
    confirm_password: Joi.any().equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' }),
    email: Joi.string().email().required().min(3).max(40),
})

const updatePasswordSchema = Joi.object({
    password: Joi.string().required().min(6).max(150),
    confirm_password: Joi.any().equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' }),
})

const planSchema = Joi.object({
    name: Joi.string().required().min(3).max(30),
    price: Joi.number().required(),
    description: Joi.string().required(),
})

const subscriptionSchema = Joi.object({
    planId: Joi.string().required(),
    chargeType: Joi.string().required(),
    paymentMethodId: Joi.string().required(),
    description: Joi.string().required(),
    amount: Joi.number().required(),
})

module.exports = {
    registerationSchema,
    loginSchema,
    updateProfileSchema,
    OTPSchema,
    PasswordResetRequestSchema,
    passwordSchema,
    updatePasswordSchema,
    planSchema,
    subscriptionSchema
}
