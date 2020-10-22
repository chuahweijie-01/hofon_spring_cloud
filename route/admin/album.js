const express = require('express');
const album_controller = require('../../controller/admin/album')

router = express.Router();
router.use(express.static('./public/'));

router.get('/', album_controller.album_display_list);
router.get('/:id', album_controller.album_category);

router.post('/',album_controller.album_add);

router.delete('/:id', album_controller.album_deleteProductImage);

module.exports = router;