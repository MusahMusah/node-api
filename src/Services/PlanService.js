const PlanSchema = require('../schema/PlansSchema');

/**
 * Create a new plan
 */
const createPlan = async (payload) => {
    return await PlanSchema(payload).save();
};

// get a plan by id
const getPlan = async (id) => {
    return PlanSchema.findById(id);
};

// get all plans
const getPlans = async () => {
    return PlanSchema.find();
};

// get all active plans
const getAllActivePlans = async () => {
    return PlanSchema.find({isActive: true}).sort({createdAt: -1});
}

// update plan
const updatePlan = async (id, payload) => {
    const plan = await PlanSchema.findByIdAndUpdate(id, {
        $set: payload
    }, { new: true });
    if (plan) return plan;
};

// delete plan
const deletePlan = async (id) => {
    await PlanSchema.findByIdAndDelete(id);
};


module.exports = {
    createPlan,
    getPlan,
    updatePlan,
    deletePlan,
    getPlans,
    getAllActivePlans
}
