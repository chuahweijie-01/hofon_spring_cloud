const express = require('express');
const category_controller = require('../../controller/admin/category')

router = express.Router();
router.use(express.static('./public/'));

//Create new admin information
router.post('/', category_controller.category_create)

//Direct to new admin page
router.get('/new', category_controller.category_new);
//Retrieve information of list of admin
router.get('/', category_controller.category_display_list);
//Retrieve information of one admin
//When triggered, check database, retrieve information
//Then direct to edit page with input filled
router.get('/:id', category_controller.category_display)

//Update admin information
router.put('/:id', category_controller.category_update)

//Delete admin information
router.delete('/:id', category_controller.category_delete)

module.exports = router;