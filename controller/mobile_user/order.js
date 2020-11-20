const order_model = require('../../model/mobile_user/order');
const getDateTime = require('../../middleware/middlewares');
const cryptoRandomString = require('crypto-random-string');

exports.addNewOrder = (req, res) => {
    var order_info = {
        order_id: getDateTime.currentDateTime().MerchantTradeNo + cryptoRandomString({length: 6, type: 'distinguishable'}),
        user_id: req.session.user,
        company_id: req.session.company,
    }
    var productArray = req.body;
    var product_info = (Object.keys(productArray).map(function (k) { return productArray[k]; }));

    order_model.addNewOrder(order_info, product_info[0])
        .then((result) => {
            res.status(200).send({ order_id: result, this_is_what_you_sent: product_info[0] });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}

exports.getOrderList = (req, res) => {
    order_model.getOrderList(req.session.company, req.session.user)
        .then((result) => {
            res.status(200).send({ order_list: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}

exports.getOrder = (req, res) => {
    order_model.getOrder(req.params.id)
        .then((result) => {
            res.render('mobile_order_view', {
                title: "訂單瀏覽",
                data: result,
                paymentResult: ''
            });
        })
        .catch((err) => {
            res.render('mobile_order_view_not_found', {
                title: "訂單瀏覽",
                message: err.message
            });
        })
}

exports.getOrderReview = (req, res) => {
    order_model.getOrderReview(req.params.id)
        .then((result) => {
            res.status(200).send({ order_info: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}

exports.deleteOrder = (req, res) => {
    order_model.deleteOrder(req.params.id)
        .then((result) => {
            res.status(200).send({ message: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}

exports.updateOrderAddress = (req, res) => {
    order_address = {
        order_id: req.params.id,
        address_id: req.query.address
    }
    order_model.updateOrderAddress(order_address, req.session.user, req.session.company)
        .then((result) => {
            res.status(200).send({ message: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}
