const router = require('express').Router();
const verifyToken = require('../../middleware/verifyToken');
const throttle = require('../../middleware/throttle');

// Importing the auth controller
const authController = require('../../Controllers/Api/Auth/authController');
router.post('/login', [throttle(60, 1)], authController.login);
router.post('/register', [throttle(60, 1)], authController.register);
router.post('/verify-account', [throttle(60, 1), verifyToken], authController.verifyAccount);
router.get('/resend-verification-otp', [throttle(60, 1), verifyToken], authController.resendVerificationOTP);
router.post('/forgot-password', [throttle(60, 1)], authController.passwordResetRequest);
router.post('/verify-password-reset-otp', [throttle(60, 1), verifyToken], authController.verifyPasswordResetOTP);
router.get('/resend-password-reset-otp', [throttle(60, 1)], authController.resendPasswordResetOTP);
router.post('/reset-password', [throttle(60, 1), verifyToken], authController.resetPassword);

module.exports = router;
