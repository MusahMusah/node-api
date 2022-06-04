const router = require('express').Router();
const verifyToken = require('../../middleware/verifyToken');
const verifyEmail = require('../../middleware/verifyEmail');
const throttle = require('../../middleware/throttle');

// Importing the user controller
const UserController = require('../../Controllers/Api/Users/UserController');
router.get('/', [throttle(60,1), verifyToken, verifyEmail], UserController.getUserInfo);
router.get('/stats', [throttle(60,1), verifyToken, verifyEmail], UserController.userDashboardStats);
router.put('/update-profile', [throttle(60, 1), verifyToken, verifyEmail], UserController.updateProfile);
router.put('/update-password', [throttle(60, 1), verifyToken, verifyEmail], UserController.updatePassword);
router.put('/update-profile-image', [throttle(60, 1), verifyToken, verifyEmail], UserController.updateProfileImage);


module.exports = router;
