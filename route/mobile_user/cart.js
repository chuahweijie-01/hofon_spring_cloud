const express = require('express');
const cart_controller = require('../../controller/mobile_user/cart');

router = express.Router();
router.use(express.static('./public/'));

router.get('/', cart_controller.cart_products);

router.post('/product/:id', cart_controller.add_to_cart);

router.delete('/', cart_controller.delete_cart);
router.delete('/product/:id', cart_controller.remove_from_cart);


module.exports = router;