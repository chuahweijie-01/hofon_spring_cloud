const express = require('express');
const product_controller = require('../../controller/admin/product');
const product_validation = require('../../middleware/admin/product_validation');
const privilegesValidation = require('../../middleware/admin/privilegesValidation');

router = express.Router();
router.use(express.static('./public/'));

router.use(privilegesValidation.privilegesCheck("5"));

router.post('/', product_controller.upload_product_images, product_validation.product_info_input, product_controller.addNewProduct);
router.post('/publish/:product_id/:category_id', product_controller.publishProduct);
router.post('/unpublish/:product_id', product_controller.unpublishProduct);

router.get('/new', product_controller.product_new);
router.get('/', product_controller.product_display_list);
router.get('/:id', product_controller.product_display);

router.put('/:id/image', product_controller.getTotalOfProductImage, product_controller.upload_product_images, product_controller.product_image_update);
router.put('/:id', product_validation.product_info_input, product_controller.updateProduct);

router.delete('/:id', product_controller.deleteProduct);
router.delete('/:product/image/:id', product_controller.deleteProductImage);

module.exports = router;