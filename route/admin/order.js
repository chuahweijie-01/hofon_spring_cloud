const express = require('express');
const order_controller = require('../../controller/admin/order')

router = express.Router();
router.use(express.static('./public/'));

//Create new admin information
router.post('/', order_controller.order_create)

//Direct to new admin page
router.get('/new', order_controller.order_new);
//Retrieve information of list of admin
router.get('/', order_controller.order_display_list);
//Retrieve information of one admin
//When triggered, check database, retrieve information
//Then direct to edit page with input filled
router.get('/:id', order_controller.order_display)

//Update admin information
router.put('/:id', order_controller.order_update)

//Delete admin information
router.delete('/:id', order_controller.order_delete)

module.exports = router;