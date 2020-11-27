const express = require('express');
const analysisController = require('../../controller/third_party_application/analysis');

router = express.Router();

router.post('/', analysisController.upload, analysisController.insertAnalysisData);
router.delete('/:id', analysisController.deleteAnalysisData);

module.exports = router;