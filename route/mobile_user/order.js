const express = require('express');
const order_controller = require('../../controller/mobile_user/order');

router = express.Router();
router.use(express.static('./public/'));

router.get('/', order_controller.order_list);
router.get('/:id', order_controller.getOrder);
router.get('/review/:id', order_controller.order_review);

router.post('/', order_controller.create_order);
router.delete('/:id', order_controller.delete_order);

router.put('/:id', order_controller.update_order_address);

module.exports = router;