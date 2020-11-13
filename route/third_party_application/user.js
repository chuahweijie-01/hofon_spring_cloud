const express = require('express');
const userController = require('../../controller/third_party_application/user');
const userValidation = require('../../middleware/third_party_application/user');

router = express.Router()

router.post('/', userValidation.userRegistrationInput, userController.registerUser);

module.exports = router;