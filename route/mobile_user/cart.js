const express = require('express');
const cart_controller = require('../../controller/mobile_user/cart');

router = express.Router();
router.use(express.static('./public/'));

router.get('/', cart_controller.getCartProductList);

router.post('/product/:id', cart_controller.addToCart);

router.delete('/:cartId/product/:id', cart_controller.deleteFromCart);
router.delete('/', cart_controller.deleteCart);

module.exports = router;