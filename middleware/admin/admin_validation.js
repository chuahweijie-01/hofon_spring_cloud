const { check, validationResult } = require('express-validator');

exports.admin_info_input = [
    check('admin_email')
        .notEmpty().withMessage('* 不可空缺')
        .isEmail().withMessage('* 請輸入正確的郵箱格式'),
    check('admin_name')
        .notEmpty().withMessage('* 不可空缺'),
    check('admin_password')
        .notEmpty().withMessage('* 不可空缺')
        .isLength({ min: 10 }).withMessage('* 密碼長度需多餘10個字元')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
        .withMessage('* 密碼組合需英數混合 至少包含一個大小寫字母'),
    check('confirmed_password')
        .notEmpty().withMessage('* 不可空缺')
        .custom((value, { req, loc, path }) => {
            if (value !== req.body.admin_password) throw new Error('密碼不符合')
            else return value;
        }).withMessage('密碼不符合'),

    (req, res, next) => {
        req.session.adminInput = {
            admin_email: req.body.admin_email,
            admin_name: req.body.admin_name
        };
        const errors = validationResult(req);
        const modified_errors = errors.array().map((obj) => {
            return Object.assign(obj, { type: `error` });
        })
        if (!errors.isEmpty()) {
            req.flash(`validation`, modified_errors);
            req.session.save(function (err) {
                res.redirect('/api/admin/new');
            })
        } else return next();
    }
]

exports.admin_info_input_edit = [
    check('admin_email')
        .notEmpty().withMessage('* 不可空缺')
        .isEmail().withMessage('* 請輸入正確的郵箱格式'),
    check('admin_name')
        .notEmpty().withMessage('* 不可空缺'),

    (req, res, next) => {
        req.session.admin_info = req.body;
        const errors = validationResult(req);
        const modified_errors = errors.array().map((obj) => {
            return Object.assign(obj, { type: `error` });
        })
        if (!errors.isEmpty()) {
            req.flash(`validation`, modified_errors);
            req.session.save(function (err) {
                res.redirect('/api/admin/' + req.params.id);
            })
        } else return next();
    }
]