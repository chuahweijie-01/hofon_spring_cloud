const express = require('express');
const mobile_controller = require('../../controller/admin/mobile')

router = express.Router();
router.use(express.static('./public/'));

//Create new admin information
router.post('/', mobile_controller.mobile_create)

//Retrieve information of list of admin
router.get('/', mobile_controller.mobile_display_list);
//Retrieve information of one admin
//When triggered, check database, retrieve information
//Then direct to edit page with input filled
router.get('/:id', mobile_controller.mobile_display)

//Update admin information
router.put('/:id', mobile_controller.mobile_update)


module.exports = router;