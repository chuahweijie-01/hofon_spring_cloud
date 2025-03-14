const express = require('express');
const company_controller = require('../../controller/mobile_user/company');

router = express.Router();
router.use(express.static('./public/'));

router.get('/', company_controller.getCompanyList);
router.get('/info', company_controller.getCompanyDetails);

router.post('/:id', company_controller.selected_company);

module.exports = router;