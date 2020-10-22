const express = require('express');
const order_controller = require('../../controller/admin/order')

router = express.Router();
router.use(express.static('./public/'));

router.post('/', order_controller.order_create)

router.get('/new', order_controller.order_new);
router.get('/', order_controller.getOrderList);
router.get('/:id', order_controller.getOrder)

router.put('/:id', order_controller.updateOrder)

router.delete('/:id', order_controller.order_delete)

module.exports = router;