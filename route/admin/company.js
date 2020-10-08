const express = require('express');
const company_controller = require('../../controller/admin/company');
const middlewares = require('../../middleware/middlewares');
const company_validation = require('../../middleware/admin/company_validation');

router = express.Router();
router.use(express.static('./public/'));

router.post('/', company_validation.company_info_input, company_controller.company_create);

router.get('/new', company_controller.company_new);
router.get('/', middlewares.checkUserRole, company_controller.company_display_list);
router.get('/:id', company_controller.company_display);

router.put('/:id', company_validation.company_info_input, company_controller.company_update);
router.put('/client/:id', company_validation.company_info_input_client, company_controller.company_update);
router.put('/:id/logo', company_controller.upload_company_logo, company_controller.update_company_logo);
router.put('/:id/bank', company_controller.upload_company_bank_image, company_controller.update_company_bank_image);

router.delete('/:id', company_controller.company_delete);

module.exports = router;