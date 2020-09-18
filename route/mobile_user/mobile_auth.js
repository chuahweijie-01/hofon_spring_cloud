const express = require('express');
const mobile_auth_controller = require('../../controller/mobile_user/mobile_auth');
const userRememberMe = require('../../middleware/middlewares');
const mobile_auth_validation = require('../../middleware/mobile_user/mobile_auth_validation');


router = express.Router();
router.use(express.static('./public/'));

router.post('/', mobile_auth_validation.user_info_input, mobile_auth_controller.auth);
router.post('/register', mobile_auth_controller.register);

router.get('/login', userRememberMe.userRememberMe, (req, res) => {
    res.redirect('/mobile/api/company');
})
router.get('/logout', mobile_auth_controller.logout);

router.get('/v2/test', mobile_auth_validation.user_info_input, (req, res) => {
    res.status(200).send({ message: "SUCCESS" });
})

module.exports = router;