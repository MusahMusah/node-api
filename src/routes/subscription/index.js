const router = require('express').Router();
const verifyToken = require('../../middleware/verifyToken');
const verifyEmail = require('../../middleware/verifyEmail');
const throttle = require('../../middleware/throttle');

const SubscriptionController = require('../../controllers/api/subscriptions/SubscriptionController');
router.post('/subscribe', [throttle(60, 1), verifyToken, verifyEmail], SubscriptionController.createSubscription);
router.get('/get-user-active-subscriptions', [throttle(60, 1), verifyToken, verifyEmail], SubscriptionController.getUserActiveSubscriptions);
router.get('/get-user-subscriptions', [throttle(60, 1), verifyToken, verifyEmail], SubscriptionController.getUserSubscriptions);

module.exports = router;
