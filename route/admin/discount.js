const express = require('express');
const discount_controller = require('../../controller/admin/discount');
const privilegesValidation = require('../../middleware/admin/privilegesValidation');
const discountValidation = require('../../middleware/admin/discount_validation');

router = express.Router();
router.use(express.static('./public/'));

router.use(privilegesValidation.privilegesCheck("6"));

router.post('/', discountValidation.discountInputValidation, discount_controller.addNewDiscount)

router.get('/new', discount_controller.discount_new);
router.get('/', discount_controller.getDiscountList);
router.get('/:id', discount_controller.getDiscount)

router.put('/:id', discountValidation.discountInputValidation, discount_controller.updateDiscount)

router.delete('/:id', discount_controller.deleteDiscount)

module.exports = router;