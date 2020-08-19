const express = require('express');
const admin_controller = require('../../controller/admin/admin');
const admin_validation = require('../../middleware/admin_validation');

router = express.Router();
router.use(express.static('./public/'));

router.post('/', admin_validation.admin_info_input, admin_controller.admin_create);

router.get('/new', admin_controller.admin_new);
router.get('/', admin_controller.admin_display_list);
router.get('/:id', admin_controller.admin_display);

router.put('/:id', admin_validation.admin_info_input_edit, admin_controller.admin_update);

router.delete('/:id', admin_controller.admin_delete);

module.exports = router;