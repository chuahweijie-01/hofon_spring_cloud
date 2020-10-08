const express = require('express');
const product_controller = require('../../controller/admin/product');
const product_validation = require('../../middleware/admin/product_validation');


router = express.Router();
router.use(express.static('./public/'));

router.post('/', product_controller.upload_product_images, product_validation.product_info_input, product_controller.product_create);
router.post('/publish/:product_id/:category_id', product_controller.product_publish);
router.post('/unpublish/:product_id', product_controller.product_unpublish);

router.get('/new', product_controller.product_new);
router.get('/', product_controller.product_display_list);
router.get('/:id', product_controller.product_display);

router.put('/:id/image', product_controller.product_image_total, product_controller.upload_product_images, product_controller.product_image_update);
router.put('/:id', product_validation.product_info_input, product_controller.product_update);

router.delete('/:id', product_controller.product_delete);
router.delete('/:product/image/:id', product_controller.image_delete);

module.exports = router;