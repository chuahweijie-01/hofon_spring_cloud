const express = require('express');
const category_controller = require('../../controller/admin/category');
const category_validation = require('../../middleware/admin/category_validation');


router = express.Router();
router.use(express.static('./public/'));

router.post('/', category_validation.category_info_input, category_controller.addNewCategory)

router.get('/new', category_controller.category_new);
router.get('/', category_controller.getCategoryList);
router.get('/:id', category_controller.getCategory)

router.put('/:id', category_validation.category_info_input, category_controller.updateCategory)

router.delete('/:id', category_controller.deleteCategory)

module.exports = router;