const cart_model = require('../../model/mobile_user/cart');

exports.cart_products = (req, res) => {
    cart_model.cart_products(req.session.user, req.session.company)
        .then((result) => {
            res.status(200).send({ cart_info: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}

exports.add_to_cart = (req, res) => {
    var quantity = req.body.quantity;
    cart_model.add_to_cart(req.session.user, req.session.company, req.params.id, quantity)
        .then((result) => {
            res.status(200).send({ message: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}

exports.remove_from_cart = (req, res) => {
    cart_model.remove_from_cart(req.params.id)
        .then((result) => {
            res.status(200).send({ message: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}

exports.delete_cart = (req, res) => {
    cart_model.delete_cart(req.session.user, req.session.company)
        .then((result) => {
            res.status(200).send({ message: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}