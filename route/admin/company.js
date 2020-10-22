const express = require('express');
const company_controller = require('../../controller/admin/company');
const middlewares = require('../../middleware/middlewares');
const company_validation = require('../../middleware/admin/company_validation');
const privilegesValidation = require('../../middleware/admin/privilegesValidation');

router = express.Router();
router.use(express.static('./public/'));

router.use(privilegesValidation.privilegesCheck("2"));

router.post('/', company_validation.company_info_input, company_controller.company_create);

router.get('/new', company_controller.company_new);
router.get('/', middlewares.checkUserRole, company_controller.company_display_list);
router.get('/:id', company_controller.company_display);

router.put('/:id', company_validation.company_info_input, company_controller.updateCompany);
router.put('/client/:id', company_validation.company_info_input_client, company_controller.updateCompany);
router.put('/:id/logo', company_controller.upload_company_logo, company_controller.updateCompanyLogo);
router.put('/:id/bank', company_controller.upload_company_bank_image, company_controller.updateCompanyBankImage);

router.delete('/:id', company_controller.deleteCompany);

module.exports = router;