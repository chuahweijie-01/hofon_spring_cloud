const express = require('express');
const user_controller = require('../../controller/admin/user')

router = express.Router();
router.use(express.static('./public/'));

router.post('/', user_controller.user_create)

router.get('/:id', user_controller.user_display)
router.get('/', user_controller.user_display_list);

router.put('/:id', user_controller.user_update)

router.delete('/:id', user_controller.user_delete)

module.exports = router;