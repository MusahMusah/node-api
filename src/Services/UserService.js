const UserSchema = require('../schema/UsersSchema');
const jwt = require("jsonwebtoken");

const generateAccessToken = async (user) => {
    const accessToken = jwt.sign({
        id: user.id,
        email: user.email,
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
    if (accessToken !== null)
    {
        return accessToken;
    }
}

const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign({
        id: user.id,
        email: user.email,
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
    try{
        const existingRefreshTokens = user.security.tokens;

        //Check if the refresh token is less than 5
        if (existingRefreshTokens.length < 5)
        {
            await UserSchema.updateOne({email: user.email}, {
                $push: { "security.tokens": {
                        refreshToken: refreshToken,
                        createdAt: new Date()
                    }}
            });
        }
        else{
            await UserSchema.updateOne({email: user.email}, {
                $pull: { "security.tokens": {
                        _id: existingRefreshTokens[0]._id
                    }}
            });

            //push the new token
            await UserSchema.updateOne({email: user.email}, {
                $push: { "security.tokens": {
                        refreshToken: refreshToken,
                        createdAt: new Date()
                    }}
            });
        }
        return refreshToken;
    }
    catch (e) {
        return false;
    }
}

/**
 * Register a user
 */
const registerUser = async (data, callable) => {
    const user = await UserSchema({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        // phone: data.phone,
    }).save();
    if (user) return callable(null, user);
}

/**
 * Get a User by Id or email  getUser
 */
const findUser = async (id = null, email = null) => {
    if (id !== null) {
        return UserSchema.findById(id);
    }
    else if (email !== null)
    {
        return UserSchema.findOne({email});
    }
}

/**
 * Set Account Verification Otp
 */
const setAccountVerificationOTP = async (user, {otp, expirationTime}) => {
    return UserSchema.findByIdAndUpdate(user._id, {
        $set: {
            'security.accountVerification': {
                otp: otp,
                otp_expiry: expirationTime
            }
        }
    }, {new: true});
}

/**
 * Set Password ResetOTP
 */
const setPasswordResetOTP = async (user, {otp, expirationTime}) => {
    return UserSchema.findByIdAndUpdate(user._id, {
        $set: {
            'security.passwordResetToken': {
                otp: otp,
                expiry: expirationTime
            }
        }
    }, {new: true});
}

/**
 * Allow Password Reset State
 */
const allowedPasswordResetState = async (user, state) => {
    await UserSchema.findByIdAndUpdate(user._id, {
        $set: {
            'security.passwordResetToken': {
                otp: null,
                otp_expiry: null,
                reset: state
            }
        }
    }, {new: true});
}

/**
 * Reset Password
 */
const resetPassword = async (user, newPassword, state) => {
    //allow the password to be reset
    await UserSchema.findOneAndUpdate({email: user.email}, {
        $set: {
            password: newPassword,
            'security.passwordResetToken' : {
                otp: null,
                expiry: null,
                reset: state,
            }
        }
    })
}

/**
 * Verify Account Verification Otp
 */
const verifyAccountVerificationOTP = async (user, otp) => {
    return UserSchema.findByIdAndUpdate(user._id, {
        $set: {
            'security.accountVerification': {
                otp: null,
                otp_expiry: null
            },
            email_verify_at: Date.now()
        }
    }, {new: true});
}

/**
 * Check if Phone Number exists
 * @param phone
 * @param id
 * @returns {Promise<boolean>}
 */
const checkIfPhoneExists = async (phone, id= null) => {
    let user;

    if (id !== null)
    {
        user = await UserSchema.findOne({phone: phone, _id: {$ne: id}});
    }
    else
    {
        user = await UserSchema.findOne({phone: phone});
    }
    if (user) return true;
}

/**
 * Update User Profile
 * @param id
 * @param data
 * @returns {Promise<Query<any, any, {}, any>>}
 */
const updateProfile = async (id, data) => {
    return UserSchema.findByIdAndUpdate(id, {
        $set: {
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone
        }
    }, {new: true});
}

/**
 * Update User Profile
 */
const updateProfileImage = async (id, uri) => {
    return UserSchema.findByIdAndUpdate(id, {
        $set: {
            image: uri
        }
    }, {new: true});
}

module.exports = {
    registerUser,
    findUser,
    generateAccessToken,
    generateRefreshToken,
    setAccountVerificationOTP,
    checkIfPhoneExists,
    updateProfile,
    verifyAccountVerificationOTP,
    setPasswordResetOTP,
    allowedPasswordResetState,
    resetPassword,
    updateProfileImage
}
