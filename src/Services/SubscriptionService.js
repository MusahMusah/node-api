const SubscriptionsSchema = require('../schema/SubscriptionsSchema');
const moment = require('moment');

// Create a new subscription
const createSubscription = async (data) => {
    const payload = {
        user: data.user.id,
        plan: data.planId,
        isSubscribed: true,
        isExpiredOn: moment().add(30, 'days').format('YYYY-MM-DD:HH:mm:ss'),
    }
    return await SubscriptionsSchema(payload).save();
};

// Fetch all user active subscriptions
const getUserActiveSubscriptions = async (userId) => {
    return SubscriptionsSchema.find({ user: userId, isSubscribed: true, $and: [{ isExpiredOn: { $gt: moment().format('YYYY-MM-DD:HH:mm:ss') } }] });
}

// get all user subscriptions
const getUserSubscriptions = async (userId) => {
    return SubscriptionsSchema.find({ user: userId });
}

// Fetch all user active subscriptions count
const getUserActiveSubscriptionsCount = async (userId) => {
    return SubscriptionsSchema.countDocuments({ user: userId, isSubscribed: true, $and: [{ isExpiredOn: { $gt: moment().format('YYYY-MM-DD:HH:mm:ss') } }] });
}

// Fetch all user expired subscriptions
const getUserExpiredSubscriptions = async (userId) => {
    return SubscriptionsSchema.find({ user: userId, isSubscribed: true, $and: [{ isExpiredOn: { $lt: moment().format('YYYY-MM-DD:HH:mm:ss') } }] });
}

// Fetch all user expired subscriptions count
const getUserExpiredSubscriptionsCount = async (userId) => {
    return SubscriptionsSchema.countDocuments({ user: userId, isSubscribed: true, $and: [{ isExpiredOn: { $lt: moment().format('YYYY-MM-DD:HH:mm:ss') } }] });
}

module.exports = {
    createSubscription,
    getUserActiveSubscriptions,
    getUserActiveSubscriptionsCount,
    getUserExpiredSubscriptions,
    getUserExpiredSubscriptionsCount,
    getUserSubscriptions
}
