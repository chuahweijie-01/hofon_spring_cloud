const product_model = require('../../model/mobile_user/product');

exports.product_display_list = (req, res) => {
    var product_info, ads_info, category_info;
    product_model.product_list(req.session.company)
        .then((product) => {
            product_info = product;
            return product_model.ads_list(req.session.company)
        })
        .then((ads) => {
            ads_info = ads;
            return product_model.category_list(req.session.company)
        })
        .then((category) => {
            category_info = category;
            res.status(200).send({ category_info: category_info, ads_info: ads_info, product_info: product_info })
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}


exports.product_display = (req, res) => {
    product_model.product_display(req.params.id, req.session.company).then((product_info) => {
        res.status(200).send({ product_info: product_info })
    }).catch((err) => {
        res.status(404).send({ message: err.message })
    })
}