const planServices = require('../../../Services/PlanService');
const validation = require("../../../middleware/validations");
const customResponse = require('../../../helpers/customResponse');
const fileUpload = require("../../../helpers/fileUpload")

/**
 * Create a new plan
 */
const createPlan = async (req, res) => {
    try {
        const { error } = validation.planSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(422).json({
                success: false,
                message: "The given data was invalid.",
                errors: error.details.map(e => e.message.replace(/\"/g, ''))
            })
        }
        // upload image
        let uri = null;
        await fileUpload(req.files.image, 'plan', async (err, res) => {
            if(err)
            {
                return res.status(400).json({
                    error: {
                        status: 400,
                        message: err
                    }
                })
            }
            uri = res;
        })

        if (uri !== null) {
            // extract name a and price payload from req.body
            const payload = {
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                image: uri,
                duration: req.body.duration,
            }

            const plan = await planServices.createPlan(payload);
            if (plan) {
                return res.status(200).json({
                    success: true,
                    message: 'Plan created successfully',
                    plan
                });
            }

            return res.status(400).json({
                success: false,
                message: 'Plan not created'
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Image not uploaded'
            });
        }

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

/**
 * Update a plan
 */
const updatePlan = async (req, res) => {
    try {
        const getPlan = await planServices.getPlan(req.params.plan);

        const { error } = validation.planSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(422).json({
                success: false,
                message: "The given data was invalid.",
                errors: error.details.map(e => e.message.replace(/\"/g, ''))
            })
        }

        // check if request has image file to upload

        if (req.files.image) {
            // upload image
            let uri = null;
            await fileUpload(req.files.image, 'plan', async (err, res) => {
                if(err)
                {
                    return res.status(400).json({
                        error: {
                            status: 400,
                            message: err
                        }
                    })
                }
                uri = res;
            })

            if (uri !== null) {
                // extract name a and price payload from req.body
                const payload = {
                    name: req.body.name,
                    price: req.body.price,
                    description: req.body.description,
                    image: uri,
                    duration: req.body.duration
                }

                const plan = await planServices.updatePlan(getPlan, payload);
                if (plan) {
                    return res.status(200).json({
                        success: true,
                        message: 'Plan updated successfully',
                        plan
                    });
                }

                return res.status(400).json({
                    success: false,
                    message: 'Plan not updated'
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Image not uploaded'
                });
            }
        } else {
            // extract name a and price payload from req.body
            const payload = {
                name: req.body.name ?? getPlan.name,
                price: req.body.price ?? getPlan.price,
                description: req.body.description ?? getPlan.description,
                image: getPlan.image,
                duration: req.body.duration ?? getPlan.duration
            }

            const plan = await planServices.updatePlan(getPlan, payload);
            if (plan) {
                return res.status(200).json({
                    success: true,
                    message: 'Plan updated successfully',
                    plan
                });
            }

            return res.status(400).json({
                success: false,
                message: 'Plan not updated'
            });
        }

        // const response = await planServices.updatePlan(getPlan.id, req.body);
        //
        // if (response) {
        //     return res.status(200).json({
        //         success: true,
        //         message: 'Plan updated successfully',
        //         response
        //     });
        // }
        //
        // return res.status(400).json({
        //     success: false,
        //     message: 'Plan not updated'
        // });
    } catch (e) {
        if (e.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Plan not found'
            });
        }
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

/**
 * Delete a plan
 */
const deletePlan = async (req, res) => {
    try {
        let { plan } = req.params;
        const getPlan = await planServices.getPlan(plan);

        await planServices.deletePlan(getPlan.id);

        return res.status(200).json({
            success: true,
            message: 'Plan deleted successfully'
        });
    } catch (e) {
        if (e.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Plan not found'
            });
        }

        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}


/**
 * Get all plans
 */
const getAllActivePlans = async (req, res) => {
    try {
        const plans = await planServices.getAllActivePlans();

        return res.status(200).json({
            success: true,
            message: 'Plans retrieved successfully',
            data: await customResponse.plansResource(plans)
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

/**
 * Get a plan
 */
const getPlan = async (req, res) => {
    try {
        let { plan } = req.params;
        const getPlan = await planServices.getPlan(plan);

        return res.status(200).json({
            success: true,
            message: 'Plan retrieved successfully',
            data: await customResponse.planResource(getPlan)
        });
    } catch (e) {
        if (e.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Plan not found'
            });
        }

        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

module.exports = {
    createPlan,
    updatePlan,
    deletePlan,
    getAllActivePlans,
    getPlan
}
