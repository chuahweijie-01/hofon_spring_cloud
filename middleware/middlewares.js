const { check, validationResult } = require('express-validator');

exports.checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/')
}

exports.checkNotAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next()
    }
    res.redirect('/api/dashboard')
}

exports.loginFormValidate = [
    check('username')
        //.isEmail().withMessage('請輸入正確的郵件格式')
        .notEmpty().withMessage('請輸入登入信息'),

    check('password')
        //.isLength({ min: 5 }).withMessage('密碼長度不足')
        .notEmpty().withMessage('請輸入密碼'),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('error', errors.array());
            req.session.save(function (err) {
                res.redirect('/');
            })
        } else {
            return next();
        }
    }
]