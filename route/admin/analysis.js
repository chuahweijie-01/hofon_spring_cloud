const express = require('express');
const analysis_controller = require('../../controller/admin/analysis');

router = express.Router();
router.use(express.static('./public/'));

router.get('/', analysis_controller.getAnalysisReportList);
router.get('/:id', analysis_controller.getAnalysisReport);

router.delete('/:id', analysis_controller.deleteAnalysisData);

module.exports = router;