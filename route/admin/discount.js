const express = require('express');
const discount_controller = require('../../controller/admin/discount')
const privilegesValidation = require('../../middleware/admin/privilegesValidation');

router = express.Router();
router.use(express.static('./public/'));

router.use(privilegesValidation.privilegesCheck("6"));

router.post('/', discount_controller.discount_create)

router.get('/new', discount_controller.discount_new);
router.get('/', discount_controller.discount_display_list);
router.get('/:id', discount_controller.discount_display)

router.put('/:id', discount_controller.discount_update)

router.delete('/:id', discount_controller.discount_delete)

module.exports = router;