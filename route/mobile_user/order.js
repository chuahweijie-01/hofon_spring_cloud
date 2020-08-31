const express = require('express');
const order_controller = require('../../controller/mobile_user/order');

router = express.Router();
router.use(express.static('./public/'));

router.post('/', order_controller.create_order);

module.exports = router;