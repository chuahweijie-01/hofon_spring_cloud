const express = require('express');
const invoice_controller = require('../../controller/admin/invoice')

router = express.Router();
router.use(express.static('./public/'));

router.get('/', invoice_controller.invoice_display_list);
router.get('/:id', invoice_controller.invoice_display);

router.put('/:id/status/:status', invoice_controller.invoice_update);

module.exports = router;