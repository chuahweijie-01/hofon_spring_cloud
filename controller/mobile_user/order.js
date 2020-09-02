const order_model = require('../../model/mobile_user/order');

exports.create_order = (req, res) => {
    var order_info = {
        user_id: req.session.user,
        company_id: req.session.company,
    }

    var alpha_json_array = req.body;
    var product_info = (Object.keys(alpha_json_array).map(function (k) { return alpha_json_array[k]; }));

    order_model.create_order(order_info, product_info[0])
        .then((result) => {
            res.status(200).send({ message: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}
