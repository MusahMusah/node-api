const router = require('express').Router();
const verifyToken = require('../../middleware/verifyToken');
const verifyEmail = require('../../middleware/verifyEmail');
const throttle = require('../../middleware/throttle');

const PlanController = require('../../Controllers/Api/Plans/PlanController');

router.get('/', [], PlanController.getAllActivePlans)
router.get('/:plan', [], PlanController.getPlan)

module.exports = router;
