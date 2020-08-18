const express = require('express');
const company_controller = require('../../controller/admin/company');
const middlewares = require('../../middleware/middlewares');


router = express.Router();
router.use(express.static('./public/'));

router.post('/', middlewares.company_info_input, company_controller.company_create)
router.get('/new', company_controller.company_new);
router.get('/', middlewares.checkUserRole, company_controller.company_display_list)
router.get('/:id', company_controller.company_display)
router.put('/:id', middlewares.company_info_input, company_controller.company_update)
router.delete('/:id', company_controller.company_delete)

module.exports = router;