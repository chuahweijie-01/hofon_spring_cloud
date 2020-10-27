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
    cart_model.addToCart(req.session.user, req.session.company, req.params.id, quantity)
        .then((result) => {
            res.status(200).send({ message: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}

exports.deleteFromCart = (req, res) => {
    var cartId = req.params.cartId;
    var productId = req.params.id;
    cart_model.deleteFromCart(cartId, productId)
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