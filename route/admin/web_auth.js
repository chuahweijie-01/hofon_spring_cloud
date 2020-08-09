const express = require('express');
const web_auth_controller = require('../../controller/admin/web_auth');
const passport = require('passport');
const middlewares = require('../../middleware/middlewares');

router = express.Router();
router.use(express.static('./public/'));

router.get('/', middlewares.checkNotAuthenticated, web_auth_controller.login_page);
router.get('/logout', web_auth_controller.logout);
router.get('/loginFailed', web_auth_controller.loginFailed);
router.get('/register', web_auth_controller.register_page);

router.post('/auth', middlewares.loginFormValidate, passport.authenticate('local-login', {
    failureRedirect: '/loginFailed'
}), web_auth_controller.auth);



module.exports = router;