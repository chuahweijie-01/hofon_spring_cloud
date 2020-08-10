const express = require('express');
const client_controller = require('../../controller/admin/client')

router = express.Router();
router.use(express.static('./public/'));

//Create new admin information
router.post('/', client_controller.client_create)

//Direct to new admin page
router.get('/new', client_controller.client_new);
//Retrieve information of list of admin
router.get('/', client_controller.client_display_list);
//Retrieve information of one admin
//When triggered, check database, retrieve information
//Then direct to edit page with input filled
router.get('/:id', client_controller.client_display)

//Update admin information
router.put('/:id', client_controller.client_update)

//Delete admin information
router.delete('/:id', client_controller.client_delete)

module.exports = router;