const { check, validationResult } = require('express-validator');

exports.category_info_input = [
    check('category_name')
        .notEmpty().withMessage('* 不可空缺'),
    check('company_id')
        .notEmpty().withMessage('* 不可空缺'),

    (req, res, next) => {
        req.session.category_info = {
            category_name: req.body.category_name,
        }
        const errors = validationResult(req);
        const modified_errors = errors.array().map((obj) => {
            return Object.assign(obj, { type: `error` });
        })
        if (!errors.isEmpty()) {
            req.flash(`validation`, modified_errors);
            req.session.save(function (err) {
                if (req.params.id) {
                    res.redirect('/api/category/' + req.params.id);
                } else {
                    res.redirect('/api/category/new');
                }
            })
        } else return next();
    }
]