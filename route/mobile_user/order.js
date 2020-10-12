const express = require('express');
const order_controller = require('../../controller/mobile_user/order');

router = express.Router();
router.use(express.static('./public/'));

router.put('/address/:id', order_controller.update_order_address);

router.get('/', order_controller.order_list);
router.get('/:id', order_controller.order_display);

router.post('/', order_controller.create_order);
router.delete('/:id', order_controller.delete_order);

module.exports = router;