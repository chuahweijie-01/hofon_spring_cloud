const { check, validationResult } = require('express-validator');

exports.checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

exports.checkNotAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/api/dashboard');
}

exports.checkUserRole = (req, res, next) => {
    if (req.session.role == 0) {
        res.redirect('/api/company/' + req.session.company);
    } else {
        return next();
    }
}

exports.userRememberMe = (req, res, next) => {
    if (req.session.loggedin == true) return next();
    else res.status(401).send({ message: `Unauthorized` });
}

exports.loginFormValidate = [
    check('username')
        .notEmpty().withMessage('請輸入登入信息')
        .isEmail().withMessage('請輸入正確的郵件格式'),

    check('password')
        .notEmpty().withMessage('請輸入密碼')
        .isLength({ min: 5 }).withMessage('密碼長度不足'),

    (req, res, next) => {
        const errors = validationResult(req);
        const modified_errors = errors.array({ onlyFirstError: true }).map((obj) => {
            return Object.assign(obj, { type: `error` });
        })
        if (!errors.isEmpty()) {
            req.flash(`flash`, modified_errors);
            req.session.save(function (err) {
                res.redirect('/');
            })
        } else return next();
    }
]