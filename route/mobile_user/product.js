
const express = require('express');
const product_controller = require('../../controller/mobile_user/product');

router = express.Router();
router.use(express.static('./public/'));

router.get('/', product_controller.product_display_list);
router.get('/:id', product_controller.product_display);

module.exports = router;