const connection = require('../../conf/db');
const privilegesCheck = require('../../model/admin/privilegesValidation');

exports.privilegesCheck = (previliges_id) => {
    return (req, res, next) => {
        if (!req.session.isAdmin) {
            privilegesCheck.privilegesCheck(req.user, previliges_id)
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