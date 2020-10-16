const express = require('express');
const analysis_controller = require('../../controller/admin/analysis');

router = express.Router();
router.use(express.static('./public/'));

router.get('/', analysis_controller.analysis_report_list);
router.get('/:id', analysis_controller.analysis_report);

module.exports = router;