const user_model = require('../../model/mobile_user/user');

exports.address_detail = (req, res) => {
    var user_address_info, city_info, country_info;
    user_model.user_address(req.session.user)
        .then((result) => {
            user_address_info = result;
            return user_model.city();
        })
        .then((result) => {
            city_info = result;
            return user_model.country();
        })
        .then((result) => {
            country_info = result;
            res.status(200).send({ user_address_info: user_address_info, city_info: city_info, country_info: country_info });
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
            res.status(200).send({ message: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}

exports.address_delete = (req, res) => {
    user_model.address_delete(req.params.id)
        .then((result) => {
            res.status(200).send({ message: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}