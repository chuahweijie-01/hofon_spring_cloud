const order_model = require('../../model/mobile_user/order');
const getDateTime = require('../../middleware/middlewares');
const cryptoRandomString = require('crypto-random-string');

exports.create_order = (req, res) => {
    var order_info = {
        order_id: getDateTime.currentDateTime().MerchantTradeNo + cryptoRandomString({length: 6, type: 'distinguishable'}),
        user_id: req.session.user,
        company_id: req.session.company,
    }

    var alpha_json_array = req.body;
    var product_info = (Object.keys(alpha_json_array).map(function (k) { return alpha_json_array[k]; }));

    order_model.create_order(order_info, product_info[0])
        .then((result) => {
            res.status(200).send({ order_id: result, this_is_what_you_sent: product_info[0] });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}

exports.order_list = (req, res) => {
    order_model.order_list(req.session.company, req.session.user)
        .then((result) => {
            res.status(200).send({ order_list: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}

exports.order_display = (req, res) => {
    order_model.order_display(req.params.id)
        .then((result) => {
            res.render('mobile_order_view', {
                title: "訂單瀏覽",
                data: result
            });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}

exports.order_test = (req, res) => {
    order_model.order_display(190, 29)
        .then((result) => {
            res.render('mobile_order_view', {
                title: "訂單瀏覽",
                data: result
            }, ((err, html) => {
                res.status(200).send(html);
            }));
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}

exports.order_review = (req, res) => {
    order_model.order_review(req.params.id)
        .then((result) => {
            res.status(200).send({ order_info: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}

exports.delete_order = (req, res) => {
    order_model.delete_order(req.params.id)
        .then((result) => {
            res.status(200).send({ message: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}

exports.update_order_address = (req, res) => {
    order_address = {
        order_id: req.params.id,
        address_id: req.query.address
    }
    order_model.update_order_address(order_address, req.session.user)
        .then((result) => {
            res.status(200).send({ message: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}