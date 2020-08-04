const express = require('express');
const award_controller = require('../../controller/admin/award')

router = express.Router();
router.use(express.static('./public/'));

//Create new admin information
router.post('/', award_controller.award_create)

//Direct to new admin page
router.get('/new', award_controller.award_new);
//Retrieve information of list of admin
router.get('/', award_controller.award_display_list);
//Retrieve information of one admin
//When triggered, check database, retrieve information
//Then direct to edit page with input filled
router.get('/:id', award_controller.award_display)

//Update admin information
router.put('/:id', award_controller.award_update)

//Delete admin information
router.delete('/:id', award_controller.award_delete)

module.exports = router;