const express = require('express');
const paymentController = require('../../controller/mobile_user/paymentGateway');

router = express.Router();

router.post('/result/:cart/:company', paymentController.paymentResult);

router.use(express.static('./public/'));


router.post('/resultInterface', paymentController.resultInterface);

router.get('/sendmail/:mailInfo', paymentController.sendNotificationMail);

router.get('/:id/:company', paymentController.generateOrder);



module.exports = router;