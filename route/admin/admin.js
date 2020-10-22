const express = require('express');
const admin_controller = require('../../controller/admin/admin');
const admin_validation = require('../../middleware/admin/admin_validation');
const privilegesValidation = require('../../middleware/admin/privilegesValidation');

router = express.Router();
router.use(express.static('./public/'));

router.use(privilegesValidation.privilegesCheck("3"));

router.post('/', admin_validation.admin_info_input, admin_controller.addNewAdmin);

router.get('/new', admin_controller.addNewAdminPage);
router.get('/', admin_controller.getAdminList);
router.get('/:id', admin_controller.getAdmin);

router.put('/:id', admin_validation.admin_info_input_edit, admin_controller.updateAdmin);

router.delete('/:id', admin_controller.deleteAdmin);

module.exports = router;