const express = require('express');
const mobile_controller = require('../../controller/admin/mobile');
const privilegesValidation = require('../../middleware/admin/privilegesValidation');

router = express.Router();
router.use(express.static('./public/'));

router.use(privilegesValidation.privilegesCheck("9"));

router.post('/', mobile_controller.updateAppInterfaceSetting)

router.get('/', mobile_controller.getAppInterfaceSetting);
router.get('/:id', mobile_controller.mobile_display)

router.put('/:id', mobile_controller.mobile_update)

module.exports = router;