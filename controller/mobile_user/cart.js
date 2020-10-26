const cart_model = require('../../model/mobile_user/cart');

exports.getCartProductList = (req, res) => {
    cart_model.getCartProductList(req.session.user, req.session.company)
        .then((result) => {
            res.status(200).send({ cart_info: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}

exports.addToCart = (req, res) => {
    var quantity = req.body.quantity;
    console.log(`Cart Quantity : ${quantity}`);
    cart_model.addToCart(req.session.user, req.session.company, req.params.id, quantity)
        .then((result) => {
            res.status(200).send({ message: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}

exports.deleteFromCart = (req, res) => {
    cart_model.deleteFromCart(req.params.id)
        .then((result) => {
            res.status(200).send({ message: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}

exports.deleteCart = (req, res) => {
    cart_model.deleteCart(req.session.user, req.session.company)
        .then((result) => {
            res.status(200).send({ message: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}