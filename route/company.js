const express = require('express');
const company_controller = require('../controller/company')

router = express.Router();
router.use(express.static('./public/'));

//Create new commpany information
router.post('/', company_controller.company_create)

//Direct to new company page
router.get('/new', company_controller.company_new);
//Retrieve information of list of companies
router.get('/', company_controller.company_display_list)
//Retrieve information of one company
//When triggered, check database, retrieve information
//Then direct to edit page with input filled
router.get('/:id', company_controller.company_display)


//Update company information
router.put('/:id', company_controller.company_update)

//Delete company information
router.delete('/:id', company_controller.company_delete)

module.exports = router;