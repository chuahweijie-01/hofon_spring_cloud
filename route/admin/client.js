const express = require('express');
const client_controller = require('../../controller/admin/client');
const client_validation = require('../../middleware/admin/client_validation');

router = express.Router();
router.use(express.static('./public/'));

//Create new admin information
router.post('/', client_validation.client_info_input, client_controller.addNewClient)

//Direct to new admin page
router.get('/new', client_controller.client_new);
//Retrieve information of list of admin
router.get('/', client_controller.getClientList);
//Retrieve information of one admin
//When triggered, check database, retrieve information
//Then direct to edit page with input filled
router.get('/:id', client_controller.getClient)

//Update admin information
router.put('/:id', client_validation.client_info_input_edit, client_controller.updateClient)

//Delete admin information
router.delete('/:id', client_controller.deleteClient)

module.exports = router;