const company_model = require('../../model/mobile_user/company');

exports.company_list = (req, res) => {
    company_model.company_list(req.session.user)
        .then((result) => {
            for (var i = 0; i < result.length; i++) delete result[i].user_id;
            res.status(200).send({ company_info: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}

exports.company_details = (req, res) => {
    company_model.company_details(req.session.company)
        .then((result) => {
            res.status(200).send({ company_info: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}

exports.selected_company = (req, res) => {
    req.session.company = req.params.id;
    req.session.save(function (err) {
        res.redirect('/mobile/api/product');
    })
}

