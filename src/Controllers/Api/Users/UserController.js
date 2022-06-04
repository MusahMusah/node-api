const validation = require('../../../middleware/validations');
const userService = require('../../../Services/UserService');
const paymentService = require('../../../Services/PaymentService');
const subscriptionService = require('../../../Services/SubscriptionService');
const customResponse = require("../../../helpers/customResponse");
const hash = require('../../../helpers/hashPassword')
const fileUpload = require("../../../helpers/fileUpload");

/**
 * Get User Info
 */
const getUserInfo = async (req, res) => {
    try {
        const user = await userService.findUser(req.user.id);
        return res.status(200).json({
            status: true,
            message: "User Info Successfully Fetched",
            data: {
                user: await customResponse.userData(user)
            }
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
}

/**
 * User Dashboard
 */
const userDashboardStats = async (req, res) => {
    try {
        const user = await userService.findUser(req.user.id);
        return res.status(200).json({
            status: true,
            message: "User Dashboard Successfully Fetched",
            data: {
                payments: await paymentService.getUserPayments(user.id),
                activeSubscription: await subscriptionService.getUserActiveSubscriptionsCount(user.id),
                expiredSubscriptions: await subscriptionService.getUserExpiredSubscriptionsCount(user.id) ?? 0,
            }
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
}


/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
    try
    {
        const { name, phone } = req.body;

        // const { error } = validation.updateProfileSchema.validate(req.body, { abortEarly: false });
        // if (error) {
        //     return res.status(422).json({
        //         success: false,
        //         message: "The given data was invalid.",
        //         errors: error.details.map(e => e.message.replace(/\"/g, ''))
        //     })
        // }

        const phoneAlreadyExist = await userService.checkIfPhoneExists(req.body.phone, req.user.id);

        if (phoneAlreadyExist)
        {
            return res.status(422).json({
                error: {
                    status: 422,
                    message: 'Phone number already taken'
                }
            })
        }
        const user = await userService.updateProfile(req.user.id, req.body);

        return res.status(200).json({
            success: {
                status: 200,
                message: 'Profile updated successfully',
                data: await customResponse.userData(user)
            }
        })
    }
    catch (e) {
        return res.status(500).json({
            error: {
                status: 500,
                message: e.message
            }
        })
    }
}

/**
 * Update user password
 */
const updatePassword = async (req, res) => {
    try
    {
        const { error } = validation.updatePasswordSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(422).json({
                success: false,
                message: "The given data was invalid.",
                errors: error.details.map(e => e.message.replace(/\"/g, ''))
            })
        }

        const user = await userService.findUser(req.user.id);
        const newPassword = await hash.hashPassword(req.body.password);

        await userService.resetPassword(user, newPassword, false)

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        })

    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

/**
 * Update Profile Image
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const updateProfileImage = async (req, res) => {
    try
    {
        const profile = req.files.file;

        if (profile !== undefined)
        {
            await fileUpload(profile, 'avatar', async (err, result) => {
                if (err)
                {
                    return res.status(500).json({
                        error: {
                            status: 500,
                            message: err
                        }
                    })
                }

                const user = await userService.updateProfileImage(req.user.id, result);

                return res.status(200).json({
                    success: {
                        status: 200,
                        message: 'Profile updated successfully',
                        data: await customResponse.userData(user)
                    }
                })
            })
        }
    }
    catch (e) {
        return res.status(500).json({
            error: {
                status: 500,
                message: e.message
            }
        })
    }
}

module.exports = {
    getUserInfo,
    updateProfile,
    updatePassword,
    userDashboardStats,
    updateProfileImage
}
