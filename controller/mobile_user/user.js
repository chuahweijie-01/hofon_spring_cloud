const user_model = require('../../model/mobile_user/user');

exports.address_detail = (req, res) => {
    user_model.user_address(req.session.user)
        .then((user_address_info) => {
            res.status(200).send({ user_address_info: user_address_info });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}

exports.address_city = (req, res) => {
    user_model.city(req.params.id)
        .then((city_info) => {
            res.status(200).send({ city_info: city_info })
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}

exports.address_country = (req, res) => {
    user_model.country()
        .then((country_info) => {
            res.status(200).send({ country_info: country_info })
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}

exports.address_create = (req, res) => {
    var address_info = {
        address_detail: req.body.address_detail,
        city_id: req.body.city_id
    }
    user_model.address_create(req.session.user, address_info)
        .then((result) => {
            res.redirect(`/mobile/api/user/address`);
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}

exports.address_delete = (req, res) => {
    user_model.address_delete(req.params.id)
        .then((result) => {
            res.redirect(`/mobile/api/user/address`);
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}