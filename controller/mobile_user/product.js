const product_model = require('../../model/mobile_user/product');

exports.product_display_list = (req, res) => {    
    var product_info, ads_info, category_info;
    product_model.getProductList(req.session.company, req.query.category)
        .then((result) => {
            product_info = result;
            return product_model.ads_list(req.session.company)
        })
        .then((result) => {
            ads_info = result;
            return product_model.getCategoryList(req.session.company)
        })
        .then((result) => {
            category_info = result;
            res.status(200).send({ company_info: req.session.company, category_info: category_info, ads_info: ads_info, product_info: product_info })
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}

exports.product_display = (req, res) => {
    var product_info, award_info, image_info;
    product_model.product_display(req.params.id, req.session.company)
        .then((result) => {
            product_info = result;
            return product_model.award_details(product_info[0].product_id)
        })
        .then((result) => {
            award_info = result;
            return product_model.product_image(product_info[0].product_id)
        })
        .then((result) => {
            image_info = result;
            res.status(200).send({ product_info: product_info, award_info: award_info, image_info: image_info })
        }).catch((err) => {
            res.status(404).send({ message: err.message })
        })
}