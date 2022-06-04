const router = require('express').Router();
const verifyToken = require('../../middleware/verifyToken');
const verifyEmail = require('../../middleware/verifyEmail');
const throttle = require('../../middleware/throttle');
const isAdmin = require('../../middleware/isAdmin');

const PlanController = require('../../controllers/api/plans/PlanController');
router.post('/create-plan', [throttle(60, 1), verifyToken, verifyEmail, isAdmin], PlanController.createPlan);
router.put('/update-plan/:plan', [throttle(60, 1), verifyToken, verifyEmail, isAdmin], PlanController.updatePlan);
router.delete('/delete-plan/:plan', [throttle(60, 1), verifyToken, verifyEmail, isAdmin], PlanController.deletePlan);

module.exports = router;
