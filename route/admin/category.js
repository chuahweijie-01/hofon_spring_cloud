const express = require('express');
const category_controller = require('../../controller/admin/category');
const category_validation = require('../../middleware/category_validation');


router = express.Router();
router.use(express.static('./public/'));

router.post('/', category_validation.category_info_input, category_controller.category_create)

router.get('/new', category_controller.category_new);
router.get('/', category_controller.category_display_list);
router.get('/:id', category_controller.category_display)

router.put('/:id', category_validation.category_info_input, category_controller.category_update)

router.delete('/:id', category_controller.category_delete)

module.exports = router;