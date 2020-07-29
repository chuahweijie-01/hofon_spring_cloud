const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const web_auth_controller = require('../controller/web_auth');

router = express.Router();
router.use(express.static('./public/'));
router.use(flash());

router.get('/', web_auth_controller.login_page);
router.get('/logout', web_auth_controller.logout);
router.post('/', web_auth_controller.login);

module.exports = router;