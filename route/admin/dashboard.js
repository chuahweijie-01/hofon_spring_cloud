const express = require('express');
const dashboard_controller = require('../../controller/admin/dashboard')

router = express.Router();
router.use(express.static('./public/'));

router.get('/', dashboard_controller.dashboard);

module.exports = router;