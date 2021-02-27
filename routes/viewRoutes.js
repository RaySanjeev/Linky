const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.route('/').get(viewController.renderLogin);
router.route('/room').get(viewController.renderRoom);

module.exports = router;
