const order_model = require('../../model/mobile_user/order');

exports.create_order = (req, res) => {
    var order_info = {
        user_id: req.session.user,
        company_id: req.session.company,
        order_total_item: req.body.order_total_item,
        order_tax : req.body.order_total_price * 0.06,
        order_total_price: req.body.order_total_price
    }
    product_info = [29, 28, 27, 26];
    order_model.create_order(order_info, product_info)
        .then((result) => {
            res.status(200).send({ message: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}
