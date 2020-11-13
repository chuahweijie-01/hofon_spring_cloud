const express = require('express');
const mobileAuthController = require('../../controller/mobile_user/mobile_auth');
const userRememberMe = require('../../middleware/middlewares');
const userValidation = require('../../middleware/mobile_user/mobile_auth_validation');

router = express.Router();
router.use(express.static('./public/'));

router.post('/', userValidation.userLoginInput, mobileAuthController.auth);

router.get('/logout', mobileAuthController.logout);
router.get('/login', userRememberMe.userRememberMe, (req, res) => {
    res.redirect('/mobile/api/company');
});

module.exports = router;