const express = require('express');
const company_controller = require('../../controller/admin/company');
const middlewares = require('../../middleware/middlewares');
const company_validation = require('../../middleware/company_validation');

router = express.Router();
router.use(express.static('./public/'));

router.post('/', company_validation.company_info_input, company_controller.company_create);

router.get('/new', company_controller.company_new);
router.get('/', middlewares.checkUserRole, company_controller.company_display_list);
router.get('/:id', company_controller.company_display);

router.put('/:id', company_validation.company_info_input, company_controller.company_update);
router.put('/client/:id', company_validation.company_info_input_client, company_controller.company_update);

router.delete('/:id', company_controller.company_delete);

module.exports = router;