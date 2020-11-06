const express = require('express');
const dashboardController = require('../../controller/admin/dashboard')

router = express.Router();
router.use(express.static('./public/'));

router.get('/', dashboardController.dashboard);
router.get('/orderstatistic', dashboardController.orderstatistic);
router.get('/revenuestatistic/month', dashboardController.getRevenueReportByMonth);

module.exports = router;