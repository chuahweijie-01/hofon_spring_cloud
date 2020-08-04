const express = require('express');
const user_controller = require('../../controller/admin/user')

router = express.Router();
router.use(express.static('./public/'));

//Create new user information
router.post('/', user_controller.user_create)
//Create new address information according to user
router.post('/:id/address', user_controller.user_create_address)

//Retrieve information of one user
router.get('/:id', user_controller.user_display)
//Retrieve information of list of users
router.get('/', user_controller.user_display_list);
//Retrieve address information according to users
router.get('/:id/address', user_controller.user_display_address);

//Update user information
router.put('/:id', user_controller.user_update)

//Delete user information
router.delete('/:id', user_controller.user_delete)
//Delete address information according to user 
router.delete('/:id/address', user_controller.user_delete_address)

module.exports = router;