const express = require('express');
const order_controller = require('../../controller/mobile_user/order');

router = express.Router();
router.use(express.static('./public/'));

router.get('/', order_controller.getOrderList);
router.get('/:id', order_controller.getOrder);
router.get('/review/:id', order_controller.getOrderReview);

router.post('/', order_controller.addNewOrder);
router.delete('/:id', order_controller.deleteOrder);

router.put('/:id', order_controller.updateOrderAddress);

module.exports = router;