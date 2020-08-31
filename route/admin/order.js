const express = require('express');
const order_controller = require('../../controller/admin/order')

router = express.Router();
router.use(express.static('./public/'));

router.post('/', order_controller.order_create)

router.get('/new', order_controller.order_new);
router.get('/', order_controller.order_display_list);
router.get('/:id', order_controller.order_display)

router.put('/:id', order_controller.order_update)

router.delete('/:id', order_controller.order_delete)

module.exports = router;