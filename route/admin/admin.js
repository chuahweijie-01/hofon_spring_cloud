const express = require('express');
const admin_controller = require('../../controller/admin/admin')

router = express.Router();
router.use(express.static('./public/'));

//Create new admin information
router.post('/', admin_controller.admin_create)

//Direct to new admin page
router.get('/new', admin_controller.admin_new);
//Retrieve information of list of admin
router.get('/', admin_controller.admin_display_list);
//Retrieve information of one admin
//When triggered, check database, retrieve information
//Then direct to edit page with input filled
router.get('/:id', admin_controller.admin_display)

//Update admin information
router.put('/:id', admin_controller.admin_update)

//Delete admin information
router.delete('/:id', admin_controller.admin_delete)

module.exports = router;