const userService = require("../services/userService");
const planService = require("../services/planService");
const moment = require("moment");

const userData = async (user) => {
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        image: user.image,
        phone: user.phone,
        accountType: user.accountType,
        role: user.role,
        createdAt: user.createdAt
    };
}

const planResource = async (data) => {
    return {
            id: data.id,
            name: data.name,
            description: data.description,
            image: data.image,
            price: data.price,
            status: data.isActive ? 'Active' : 'Inactive',
            createdAt: data.createdAt
        }
}

const plansResource = async (data) => {
    let result = [];

    if (data.length > 0)
    {
        for(const plan of data)
        {
            result = [...result, {
                id: plan._id,
                name: plan.name,
                price: plan.price,
                description: plan.description,
                image: plan.image,
                status: plan.isActive ? 'Active' : 'Inactive',
                createdAt: plan.createdAt
            }];
        }
    }
    return result;
}

const subscriptionsResource = async (data) => {
    let result = [];

    if (data.length > 0)
    {
        for(const subscription of data)
        {
            result = [...result, {
                id: subscription._id,
                plan: await _displayPlan(subscription.plan),
                isSubscribed: subscription.isSubscribed,
                isExpiredOn: subscription.isExpiredOn,
                createdAt: subscription.createdAt
            }];
        }
    }
    return result;
}

const _displayPlan = async (planId) => {
    const p = await planService.getPlan(planId);
    return {
        id: p._id,
        name: p.name
    }
}

module.exports = {
    userData,
    planResource,
    plansResource,
    subscriptionsResource
}
