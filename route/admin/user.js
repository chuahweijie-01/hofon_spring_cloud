const express = require('express');
const user_controller = require('../../controller/admin/user');
const privilegesValidation = require('../../middleware/admin/privilegesValidation');

router = express.Router();
router.use(express.static('./public/'));

router.use(privilegesValidation.privilegesCheck("4"));

router.get('/', user_controller.user_display_list);

router.post('/:id/reactive', user_controller.user_reactivate);
router.post('/:id/deactive', user_controller.user_deactivate);

module.exports = router;