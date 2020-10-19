const express = require('express');
const analysis_controller = require('../../controller/mobile_user/analysis');

router = express.Router();
router.use(express.static('./public/'));

router.post('/', analysis_controller.insertAnalysisData);

module.exports = router;