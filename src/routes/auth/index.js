const router = require('express').Router();
const verifyToken = require('../../middleware/verifyToken');
const throttle = require('../../middleware/throttle');

// Importing the auth controller
const AuthController = require('../../Controllers/Api/Auth/AuthController');


router.post('/login', [throttle(60, 1)], AuthController.login);
router.post('/register', [throttle(60, 1)], AuthController.register);
router.post('/verify-account', [throttle(60, 1), verifyToken], AuthController.verifyAccount);
router.get('/resend-verification-otp', [throttle(60, 1), verifyToken], AuthController.resendVerificationOTP);
router.post('/forgot-password', [throttle(60, 1)], AuthController.passwordResetRequest);
router.post('/verify-password-reset-otp', [throttle(60, 1), verifyToken], AuthController.verifyPasswordResetOTP);
router.get('/resend-password-reset-otp', [throttle(60, 1)], AuthController.resendPasswordResetOTP);
router.post('/reset-password', [throttle(60, 1), verifyToken], AuthController.resetPassword);

module.exports = router;
