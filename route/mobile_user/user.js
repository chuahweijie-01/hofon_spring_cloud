const express = require('express');
const user_controller = require('../../controller/mobile_user/user')

router = express.Router();
router.use(express.static('./public/'));

router.post('/', user_controller.user_create)

router.get('/', user_controller.user_display_list);

router.delete('/:id', user_controller.user_delete)

module.exports = router;