const express = require('express');
const ads_controller = require('../../controller/admin/ads')

router = express.Router();
router.use(express.static('./public/'));

//Create new admin information
router.post('/', ads_controller.ads_create)

//Direct to new admin page
router.get('/new', ads_controller.ads_new);
//Retrieve information of list of admin
router.get('/', ads_controller.ads_display_list);
//Retrieve information of one admin
//When triggered, check database, retrieve information
//Then direct to edit page with input filled
router.get('/:id', ads_controller.ads_display)

//Update admin information
router.put('/:id', ads_controller.ads_update)

//Delete admin information
router.delete('/:id', ads_controller.ads_delete)

module.exports = router;