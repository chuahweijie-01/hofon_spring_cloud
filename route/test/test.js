const express = require('express');
const testController = require('../../controller/test/test');
const uuid = require('uuid');

router = express.Router();

router.post('/analysis', testController.upload, (req, res) => {

    var newJSONObject = {
        analysisInfo: JSON.parse(req.body.analysisInfo),
        analysisDetails: JSON.parse(req.body.analysisDetails)
    }

    console.log(newJSONObject);

    res.status(200).send("成功上傳");
})

router.delete('/', testController.deleteAPI);

router.get('/uuid', (req, res) => {
    console.log(uuid.v4())
    res.send(uuid.v4());
});

router.get('/paymentInterface', (req, res) => {
    res.render('paymentResult', {
        paymentResult: 1
    })
});


module.exports = router;