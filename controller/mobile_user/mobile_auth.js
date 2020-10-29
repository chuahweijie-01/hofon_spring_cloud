const mobile_auth_model = require('../../model/mobile_user/mobile_auth');
const bcrypt = require('bcrypt');

exports.auth = (req, res) => {
    user_info = {
        user_email: req.body.user_email,
        user_password: req.body.user_password
    }
    mobile_auth_model.auth(user_info)
        .then((result) => {
            req.session.user = result;
            req.session.loggedin = true;
            req.session.save((err) => {
                res.status(201).send({ message: '登入成功' })
            })
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })
}

exports.register = (req, res) => {
    bcrypt.hash(req.body.user_password, 10, (err, hash) => {
        user_info = {
            user_email: req.body.user_email,
            user_password: hash,
        };
        mobile_auth_model.register(user_info)
        .then((result) => {
            res.status(201).send({ message: result })
        })
        .catch((err) => {
            console.log(err)
            res.status(404).send({ message: err.message })
        })
    })
}

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.send({ message: err })
        } else {
            res.status(200).send({ message: '已登出系統' })
        }
    })
}