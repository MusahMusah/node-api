const PaymentsSchema = require('../schema/PaymentsSchema');
const globalHelper = require('../helpers/globalHelper')

// Create Payment
const initiatePaymentLog = async (payload) => {
    return PaymentsSchema.create({
        user: payload.user.id,
        planId: payload.planId,
        amount: payload.amount,
        txnId:  await globalHelper.generateReference(),
        paymentMethod: payload.paymentMethod
    })
}

// Update Payment
const updatePaymentLog = async (payment, payload) => {
    return PaymentsSchema.findOneAndUpdate({
        txnId: payment.txnId,
        user: payment.user
    }, {
        $set: {
            status: payload.status ?? payment.status,
            errorMessage: payload.errorMessage ?? payment.errorMessage,
        }
    })
}

// Get Payments
const getUserPayments = async (user) => {
    return PaymentsSchema.find({
        user: user, $and: [{status: 'succeeded'}]
    })
}

module.exports = {
    initiatePaymentLog,
    updatePaymentLog,
    getUserPayments
}
