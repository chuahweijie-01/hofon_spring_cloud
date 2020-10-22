const express = require('express');
const user_controller = require('../../controller/admin/user');
const privilegesValidation = require('../../middleware/admin/privilegesValidation');

router = express.Router();
router.use(express.static('./public/'));

router.use(privilegesValidation.privilegesCheck("4"));

router.get('/', user_controller.getUserList);

router.post('/:id/reactive', user_controller.reactivateUser);
router.post('/:id/deactive', user_controller.deactivateUser);

module.exports = router;