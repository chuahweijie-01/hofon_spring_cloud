const connection = require('../../conf/db');
const privilegesCheck = require('../../model/admin/privilegesValidation');

exports.privilegesCheck = (previligesId) => {
    return (req, res, next) => {
        if (!req.session.isAdmin) {
            privilegesCheck.privilegesCheck(req.user, previligesId)
                .then((result) => {
                    next();
                })
                .catch((err) => {
                    req.flash(`flash`, {
                        msg: err.message, type: `error`
                    });
                    req.session.save(function (err) {
                        res.redirect('/api/dashboard');
                    })
                })
        } else next();
    }
}