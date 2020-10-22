const company_model = require('../../model/mobile_user/company');

exports.getCompanyList = (req, res) => {
    company_model.getCompanyList(req.session.user)
        .then((result) => {
            res.status(200).send({ company_info: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}

exports.getCompanyDetails = (req, res) => {
    company_model.getCompanyDetails(req.session.company)
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

