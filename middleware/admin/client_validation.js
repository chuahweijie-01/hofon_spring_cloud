const { check, validationResult } = require('express-validator');

exports.client_info_input = [
    check('admin_email')
        .notEmpty().withMessage('* 不可空缺'),
    check('admin_name')
        .notEmpty().withMessage('* 不可空缺'),
    check('admin_password')
        .notEmpty().withMessage('* 不可空缺'),
    check('confirmed_password')
        .notEmpty().withMessage('* 不可空缺')
        .custom((value, { req, loc, path }) => {
            if (value !== req.body.admin_password) throw new Error('Password Not Matched')
            else return value;
        }).withMessage('Password Not Matched'),
    check('privileges_id')
        .notEmpty().withMessage('* 不可空缺'),

    (req, res, next) => {
        req.session.client_info = {
            admin_email: req.body.admin_email,
            admin_name: req.body.admin_name
        }
        const errors = validationResult(req);
        const modified_errors = errors.array().map((obj) => {
            return Object.assign(obj, { type: `error` });
        })
        if (!errors.isEmpty()) {
            req.flash(`validation`, modified_errors);
            req.session.save(function (err) {
                res.redirect('/api/client/new');
            })
        } else return next();
    }
]

exports.client_info_input_edit = [
    check('admin_email')
        .notEmpty().withMessage('* 不可空缺'),
    check('admin_name')
        .notEmpty().withMessage('* 不可空缺'),
    check('privileges_id')
        .notEmpty().withMessage('* 不可空缺'),

    (req, res, next) => {
        req.session.client_info = {
            admin_email: req.body.admin_email,
            admin_name: req.body.admin_name
        }
        const errors = validationResult(req);
        const modified_errors = errors.array().map((obj) => {
            return Object.assign(obj, { type: `error` });
        })
        if (!errors.isEmpty()) {
            req.flash(`validation`, modified_errors);
            req.session.save(function (err) {
                res.redirect('/api/client/' + req.params.id);
            })

        } else return next();
    }
]