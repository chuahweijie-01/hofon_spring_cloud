const express = require('express');
const paymentController = require('../../controller/mobile_user/paymentGateway');

router = express.Router();
router.use(express.static('./public/'));

router.post('/resultInterface', paymentController.resultInterface);

router.get('/:id/:company', paymentController.generateOrder);

router.post('/result/:id/:company', paymentController.paymentResult);

module.exports = router;