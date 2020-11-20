const express = require('express');
const testController = require('../../controller/test/test');
const uuid = require('uuid');

router = express.Router();
router.use(express.static('./public/'));

router.delete('/', testController.deleteAPI);

router.get('/uuid', (req, res) => {
    console.log(uuid.v4())
    res.send(uuid.v4());
});

router.get('/paymentInterface', (req, res) => {
    res.render('paymentResult', {
        paymentResult: 1
    })
})

module.exports = router;