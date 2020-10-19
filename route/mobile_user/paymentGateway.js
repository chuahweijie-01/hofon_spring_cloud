const express = require('express');
const paymentController = require('../../controller/mobile_user/paymentGateway');

router = express.Router();
router.use(express.static('./public/'));

router.post('/resultInterface', paymentController.resultInterface);

router.get('/notify', paymentController.notifyClient);
router.get('/:id', paymentController.generateOrder);

router.post('/result/:id', paymentController.paymentResult);

module.exports = router;