const express = require('express');
const user_controller = require('../../controller/mobile_user/user')

router = express.Router();
router.use(express.static('./public/'));

router.post('/address', user_controller.address_create);

router.get('/address', user_controller.address_detail);

router.delete('/address/:id', user_controller.address_delete);

module.exports = router;