const express = require('express');
const company_controller = require('../../controller/mobile_user/company');

router = express.Router();
router.use(express.static('./public/'));

router.get('/:id', company_controller.selected_company);

module.exports = router;