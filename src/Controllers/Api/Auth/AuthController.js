const validation = require('../../../middleware/validations');
const hash = require('../../../helpers/hashPassword')
const userService = require('../../../Services/UserService');
const customResponse = require("../../../helpers/customResponse");
const { generateOTP } = require('../../../helpers/otp')
const emailEvent = require('../../../events/Emails')
const moment = require("moment");

/**
 * User Registration
 */
const register = async (req, res) => {
    try{
        const { error } = validation.registerationSchema.validate(req.body, { abortEarly: false })
        if (error)
        {
            return res.status(400).json({
                success: false,
                message: "The given data was invalid.",
                errors: error.details.map(e => e.message.replace(/\"/g, ''))
            })
        }
        const { first_name, last_name, email, password } = req.body

        const data = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: await hash.hashPassword(password),
            // phone: phone
        }

        await userService.registerUser(data, async (error, user) => {
            if (error) {
                return res.status(400).json({
                    error: {
                        status: 400,
                        message: 'Something went wrong'
                    }
                })
            }

            //generate the user access token
            const accessToken = await userService.generateAccessToken(user);

            //generate the refresh token
            const refreshToken = await userService.generateRefreshToken(user);

            // set Otp Verification
            const newUser = await userService.setAccountVerificationOTP(user, generateOTP())

            // send welcome email
            await emailEvent.sendWelcomeEmail(newUser)

            return res.status(201).json({
                success: {
                    status: 201,
                    message: 'User created successfully',
                    data: {
                        user: await customResponse.userData(user),
                        accessToken,
                        refreshToken
                    }
                }
            })
        })
    }
    catch (e) {
        console.log(e)
        let errorMessage;

        if(e.keyPattern.email === 1)
        {
            errorMessage = 'Email already exists'
        }

        // else if(e.keyPattern.phone === 1)
        // {
        //     errorMessage = 'Phone number already exists'
        // }
        else
        {
            errorMessage = e.message;
        }

        return res.status(500).json({
            error: {
                status: 500,
                message: errorMessage
            }
        })
    }
}

/**
 * User Login
 */
const login = async (req, res) => {
    try{
        const { error } = validation.loginSchema.validate({ email: req.body.email, password: req.body.password }, { abortEarly: false });
        if (error)
        {
            return res.status(400).json({
                error: {
                    status: 400,
                    message: error.details[0].message,
                }
            })
        }
        const { email, password } = req.body;
        const user = await userService.findUser(null, email);
        if (!user)
        {
            return res.status(400).json({
                error: {
                    status: 400,
                    message: 'invalid email or password',
                }
            })
        }
        //check if the user password is correct
        const isMatch = await hash.verifyPassword(password, user.password);
        if (!isMatch)
        {
            return res.status(400).json({
                error: {
                    status: 400,
                    message: 'invalid email or password',
                }
            })
        }

        //login was successful. generate access token
        const accessToken = await userService.generateAccessToken(user);

        //generate the refresh token
        const refreshToken = await userService.generateRefreshToken(user);

        return res.status(200).json({
            success: {
                status: 200,
                message: 'User logged in successfully',
                data: {
                    user: await customResponse.userData(user),
                    accessToken,
                    refreshToken
                }
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
 * User Verify Account
 */
const verifyAccount = async (req, res) => {
    try {
        const  { error } = validation.OTPSchema.validate({otp: req.body.otp}, { abortEarly: false });
        if (error)
        {
            return res.status(422).json({
                success: false,
                message: "The given data was invalid.",
                errors: error.details.map(e => e.message.replace(/\"/g, ''))
            })
        }

        const user = await userService.findUser(null, req.user.email);
        if (!user)
        {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        // check if the user has verified their account
        if (user.email_verify_at)
        {
            return res.status(400).json({
                success: false,
                message: "User already verified."
            })
        }

        // check if OTP has expired
        if (new Date().getTime() <= (new Date(user.security.accountVerification.otp_expiry).getTime())) {
            if (user.security.accountVerification.otp === req.body.otp)
            {
                // verify user account
                await userService.verifyAccountVerificationOTP(user, req.body.otp);
                return res.status(200).json({
                    success: true,
                    message: "User verified successfully."
                })
            }
            else
            {
                return res.status(400).json({
                    success: false,
                    message: "Invalid OTP."
                })
            }
        }
        else {
            return res.status(400).json({
                success: false,
                message: "OTP has expired."
            })
        }
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

/**
 * Resend OTP Verification Code
 */
const resendVerificationOTP = async (req, res) => {
    try {
        const user = await userService.findUser(null, req.user.email);
        if (!user)
        {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        // set Otp Verification
        const newUser = await userService.setAccountVerificationOTP(user, generateOTP())

        // resend OTP
        await emailEvent.send2faCode(newUser);

        return res.status(200).json({
            success: true,
            message: "OTP has been sent."
        })
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

/**
 * Password Reset Request
 */
const passwordResetRequest = async (req, res) => {
    try {
        const  { error } = validation.PasswordResetRequestSchema.validate({email: req.body.email}, { abortEarly: false });
        if (error)
        {
            return res.status(422).json({
                success: false,
                message: "The given data was invalid.",
                errors: error.details.map(e => e.message.replace(/\"/g, ''))
            })
        }

        const user = await userService.findUser(null, req.body.email);
        if (!user)
        {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        // set Otp Verification
        const newUser = await userService.setPasswordResetOTP(user, generateOTP())

        //generate the user access token
        const accessToken = await userService.generateAccessToken(newUser)

        // send OTP
        await emailEvent.sendPasswordRequestEmail({
            email: newUser.email,
            otp: newUser.security.passwordResetToken.otp
        });

        return res.status(200).json({
            success: true,
            message: "OTP has been sent.",
            data: {
                accessToken: accessToken
            }
        })
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

/**
 * Verify Password Reset OTP
 */
const verifyPasswordResetOTP = async (req, res) => {
    try {
        const  { error } = validation.OTPSchema.validate({otp: req.body.otp}, { abortEarly: false });
        if (error)
        {
            return res.status(422).json({
                success: false,
                message: "The given data was invalid.",
                errors: error.details.map(e => e.message.replace(/\"/g, ''))
            })
        } else {
            const user = await userService.findUser(null, req.user.email);
            if (!user)
            {
                return res.status(404).json({
                    success: false,
                    message: "User not found."
                })
            }
            if (new Date().getTime() <= (new Date(user.security.passwordResetToken.expiry).getTime()))
            {
                if (user.security.passwordResetToken.otp === req.body.otp)
                {

                    //set the reset key to be true...!!!!! Just an extra validation
                    await userService.allowedPasswordResetState(user, true);

                    return res.status(200).json({
                        success: {
                            status: 200,
                            message: "OTP verified"
                        }
                    })
                }
                else
                {
                    return res.status(400).json({
                        error: {
                            status: 400,
                            message: "Invalid User OTP"
                        }
                    });
                }
            }
            else
            {
                await userService.allowedPasswordResetState(user, false)

                return res.status(401).json({
                    error: {
                        status: 401,
                        message: "OTP expired"
                    }
                });
            }
        }
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

/**
 * Resend OTP for Password Reset
 */
const resendPasswordResetOTP = async (req, res) => {
    try {
        const user = await userService.findUser(null, req.user.email);
        if (!user)
        {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        // set Otp Verification
        const newUser = await userService.setPasswordResetOTP(user, generateOTP())

        // resend OTP
        await emailEvent.sendPasswordRequestEmail({
            email: newUser.email,
            otp: newUser.security.passwordResetToken.otp
        });

        return res.status(200).json({
            success: true,
            message: "OTP has been sent."
        })
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

/**
 * Reset Password
 */
const resetPassword = async (req, res) => {
    try{
        const { error } = validation.passwordSchema.validate(req.body, { abortEarly: false });
        if (error){
            return res.status(422).json({
                success: false,
                message: "The given data was invalid.",
                errors: error.details.map(e => e.message.replace(/\"/g, ''))
            })
        }

        const user = await userService.findUser(null, req.body.email);
        if (user)
        {
            if (user.security.passwordResetToken.reset)
            {
                const newPassword = await hash.hashPassword(req.body.password);

                //reset the password and the reset state to false.... to avoid password reset
                await userService.resetPassword(user,newPassword,false);

                return res.status(200).json({
                    success: true,
                    message: "Password has been reset."
                })
            }
            else
            {
                return res.status(401).json({
                    success: false,
                    message: "Action not allowed."
                })
            }
        }
    }
    catch (e) {
        return res.status(400).json({
            error: {
                status: 400,
                message: 'Bad request'
            }
        })
    }
}


module.exports = {
    login,
    register,
    verifyAccount,
    resendVerificationOTP,
    passwordResetRequest,
    verifyPasswordResetOTP,
    resendPasswordResetOTP,
    resetPassword
}
