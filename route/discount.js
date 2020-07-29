const express = require('express');
const discount_controller = require('../controller/discount')

router = express.Router();
router.use(express.static('./public/'));

//Create new admin information
router.post('/', discount_controller.discount_create)

//Direct to new admin page
router.get('/new', discount_controller.discount_new);
//Retrieve information of list of admin
router.get('/', discount_controller.discount_display_list);
//Retrieve information of one admin
//When triggered, check database, retrieve information
//Then direct to edit page with input filled
router.get('/:id', discount_controller.discount_display)

//Update admin information
router.put('/:id', discount_controller.discount_update)

//Delete admin information
router.delete('/:id', discount_controller.discount_delete)

module.exports = router;