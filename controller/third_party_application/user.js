const userModel = require('../../model/third_party_application/user');
const UUID = require('uuid');
const bcrypt = require('bcrypt');

exports.registerUser = (req, res) => {
    var userId = UUID.v4();
    var companyOfficialId = req.body.company_official_id;
    bcrypt.hash(req.body.user_password, 10, (err, hash) => {
        var userInfo = {
            user_id: userId,
            user_email: req.body.user_email,
            user_password: hash,
            user_name: req.body.user_name,
            user_birth_year: req.body.user_birth_year,
            user_birth_month: req.body.user_birth_month,
            user_birth_day: req.body.user_birth_day,
            user_gender: req.body.user_gender
        }
        userModel.registerUser(userInfo, companyOfficialId)
            .then((result) => {
                res.status(200).send(result);
            })
            .catch((err) => {
                res.status(404).send(err.message);
            })
    })
}