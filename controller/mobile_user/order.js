const order_model = require('../../model/mobile_user/order');

exports.create_order = (req, res) => {
    var order_info = {
        user_id: req.session.user,
        company_id: req.session.company,
    }

    var alpha_json_array = req.body;
    var product_info = (Object.keys(alpha_json_array).map(function (k) { return alpha_json_array[k]; }));

    console.log(product_info[0]);

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
    order_model.order_display(req.params.id, req.session.company)
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
    
}