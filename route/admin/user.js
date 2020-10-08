const express = require('express');
const user_controller = require('../../controller/admin/user')

router = express.Router();
router.use(express.static('./public/'));

router.get('/', user_controller.user_display_list);

router.post('/:id/reactive', user_controller.user_reactivate);
router.post('/:id/deactive', user_controller.user_deactivate);

module.exports = router;