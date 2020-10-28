const express = require('express');
const analysisController = require('../../controller/mobile_user/analysis');

router = express.Router();
router.use(express.static('./public/'));

router.get('/list', analysisController.getAnalysisReportList);
router.get('/:id', analysisController.getAnalysisReport);
router.get('/', analysisController.getAnalysisCompareReport);


module.exports = router;