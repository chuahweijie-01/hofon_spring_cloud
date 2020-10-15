const express = require('express');
const paymentController = require('../../controller/mobile_user/paymentGateway');

router = express.Router();
router.use(express.static('./public/'));

router.get('/:id', paymentController.generateOrder);

router.post('/result', paymentController.paymentResult);

module.exports = router;