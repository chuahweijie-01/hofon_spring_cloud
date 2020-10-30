const express = require('express');
const userController = require('../../controller/third_party_application/user');

router = express.Router()

router.post('/', userController.registerUser);

module.exports = router;