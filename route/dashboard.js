const express = require('express');
const dashboard_controller = require('../controller/dashboard')

router = express.Router();
router.use(express.static('./public/'));

//Retrieve dashboard data
router.get('/', dashboard_controller.dashboard);

module.exports = router;