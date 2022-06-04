const subscriptionService = require('../../../Services/SubscriptionService');
const planService = require('../../../Services/PlanService');
const stripeService = require('../../../Services/StripeService');
const paymentService = require('../../../Services/PaymentService');
const userService = require('../../../Services/UserService');
const validation = require("../../../middleware/validations");
const customResponse = require("../../../helpers/customResponse");


/**
 * Create a new subscription
 */
const createSubscription = async (req, res) => {
    let payment = null
    try {
        // validate request body
        const { error } = validation.subscriptionSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(422).json({
                success: false,
                message: "The given data was invalid.",
                errors: error.details.map(e => e.message.replace(/\"/g, ''))
            })
        }

        // add user id to request
        req.body.user = await userService.findUser(req.user.id);

        // Validate plan
        const plan = await planService.getPlan(req.body.planId);
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "The given plan was not found."
            })
        }

        // Log Payment
        payment = await paymentService.initiatePaymentLog({ ...req.body });

        // Process Payment
        await stripeService.chargeCustomer(req.body, async (err, response) => {
            if (err) {
                // Log Transaction Failed
                await paymentService.updatePaymentLog(payment, { ...req.body, ...{ status: 'failed', errorMessage: err.message } })

                return res.status(400).json({
                    success: false,
                    message: "An error occurred while processing your payment.",
                    errors: err
                })
            }

            // Create subscription
            const subscription = await subscriptionService.createSubscription(req.body)

            // Log Transaction Success
            await paymentService.updatePaymentLog(payment,{ ...req.body, ...{ status: 'succeeded'}})

            // Send response
            return res.status(201).json({
                success: true,
                message: "Subscription created successfully.",
                data: subscription
            })
        });
    } catch (e) {
        // Log Transaction Failed
        await paymentService.updatePaymentLog(payment, { ...req.body, ...{ status: 'failed', errorMessage: e.message } })

        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
};


/**
 * Get User Active Subscriptions
 */
const getUserActiveSubscriptions = async (req, res) => {
    try {
        // Get user
        const user = await userService.findUser(req.user.id);

        // Get subscriptions
        const subscriptions = await subscriptionService.getUserActiveSubscriptions(user);

        // Send response
        return res.status(200).json({
            success: true,
            message: "Subscriptions retrieved successfully.",
            data: subscriptions
        })
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
};

/**
 * Get User Subscriptions
 */
const getUserSubscriptions = async (req, res) => {
    try {
        // Get user
        const user = await userService.findUser(req.user.id);

        // Get subscriptions
        const subscriptions = await subscriptionService.getUserSubscriptions(user.id);

        // Send response
        return res.status(200).json({
            success: true,
            message: "Subscriptions retrieved successfully.",
            data: await customResponse.subscriptionsResource(subscriptions)
        })
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
};



module.exports = {
    createSubscription,
    getUserActiveSubscriptions,
    getUserSubscriptions
}
