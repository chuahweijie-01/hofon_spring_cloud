const testModel = require('../../model/test/test');
const uploadImage = require('../../middleware/test/upload_image');

exports.deleteAPI = (req, res) => {
    var cartId = '610';
    var orderId = '2020102609454585U2CU';
    testModel.deleteCartItem(cartId, orderId)
        .then((result) => {
            res.status(200).send({ message: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        });
}

exports.upload = (req, res, next) => {
    var tempFolderName = Date.now();
    req.session.tempFolderName = tempFolderName;
    uploadImage.testImageUpload(tempFolderName)(req, res, (err) => {
        if (err) res.status(404).send(err);
        else next();
    });
}