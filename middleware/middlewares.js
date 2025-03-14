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
    if (!req.session.isAdmin) {
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

exports.currentDateTime = () => {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = ("0" + date_ob.getHours()).slice(-2);
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);
    let seconds = ("0" + date_ob.getSeconds()).slice(-2);

    var MerchantTradeDate = `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`;
    var MerchantTradeNo = `${year}${month}${date}${hours}${minutes}${seconds}`;

    currentDateTimeFormat = {
        MerchantTradeDate: MerchantTradeDate,
        MerchantTradeNo: MerchantTradeNo,
    }

    return currentDateTimeFormat;
}