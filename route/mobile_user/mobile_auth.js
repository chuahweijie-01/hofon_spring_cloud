const express = require('express');
const mobile_auth_controller = require('../../controller/mobile_user/mobile_auth');

router = express.Router();
router.use(express.static('./public/'));

router.post('/', mobile_auth_controller.auth);
router.post('/register', mobile_auth_controller.register);

router.get('/logout', mobile_auth_controller.logout);

module.exports = router;