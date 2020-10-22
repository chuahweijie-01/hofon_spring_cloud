const express = require('express');
const invoice_controller = require('../../controller/admin/invoice')

router = express.Router();
router.use(express.static('./public/'));

router.get('/', invoice_controller.getInvoiceList);
router.get('/:id', invoice_controller.getInvoice);

router.put('/:id/status/:status', invoice_controller.updateInvoice);

module.exports = router;