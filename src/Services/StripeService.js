const stripeClient = require('stripe')(process.env.STRIPE_SECRET_KEY);

const _charge = async (payload) => {
    try {
        let response = null
        switch (payload.chargeType) {
            case 'existing-card':
                response = await stripeClient.paymentIntents.create({
                    amount: payload.amount,
                    currency: payload.currency,
                    payment_method_types: ['card'],
                    receipt_email: payload.email,
                    description: payload.description,
                    metadata: {
                        order_id: payload.orderId
                    }
                });
                break;
            case 'one-time-card':
                break
        }

        // check if payment was successful
        if (response.status === 'succeeded') {
            // update Queue

            // update Transaction
            return response
        } else {
            throw new Error(response)
        }
    } catch (e) {
        throw new Error(e);
    }
}

const processCharge = async (payload, callback) => {
    try {
        let response = await _charge(payload)
        callback(null, response)
    } catch (e) {
        callback(e, null)
    }
}

const chargeCustomer = async (payload, callback) => {
    let payment = null
    let result = null
    let error = null

    switch (payload.chargeType) {
        case 'existing-card':
            payment = await stripeClient.paymentIntents.create({
                amount: payload.amount,
                currency: payload.currency,
                payment_method_types: ['card'],
                receipt_email: payload.email,
                description: payload.description,
                metadata: {
                    order_id: payload.orderId
                }
            });
            break;
        case 'one-time-card':
            payment = await stripeClient.paymentIntents.create({
                payment_method_types: ['card'],
                payment_method: payload.paymentMethodId,
                amount: payload.amount * 100,
                currency: payload.currency ?? 'usd',
                description: payload.description,
                metadata: {
                    fullName: payload.user.first_name + ' ' + payload.user.last_name,
                },
                confirm: true
            });
            break
    }

    if (payment.status === 'succeeded') {
        result = payment
    } else {
        error = payment
    }
    return callback(error, result)
}

module.exports = {
    chargeCustomer
}
