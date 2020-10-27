const testModel = require('../../model/test/test');

exports.deleteAPI = (req, res) => {
    var cartId = '610';
    var orderId = '2020102609454585U2CU';
    testModel.deleteCartItem(cartId, orderId)
        .then((result) => {
            res.status(200).send({ message: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}