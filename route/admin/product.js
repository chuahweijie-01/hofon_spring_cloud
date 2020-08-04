const express = require('express');
const product_controller = require('../../controller/admin/product')

router = express.Router();
router.use(express.static('./public/'));

//Create new product information
router.post('/', product_controller.product_create)

//Direct to new company page
router.get('/new', product_controller.product_new);
//Retrieve information of list of products
router.get('/', product_controller.product_display_list)
//Retrieve information of one company
//When triggered, check database, retrieve information
//Then direct to edit page with input filled
router.get('/:id', product_controller.product_display)

//Update product information
router.put('/:id', product_controller.product_update)

//Delete product information
router.delete('/:id', product_controller.product_delete)

module.exports = router;