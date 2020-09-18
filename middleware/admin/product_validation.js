const { check, validationResult } = require('express-validator');

exports.product_info_input = [
    check('product_name')
        .trim()
        .notEmpty().withMessage('* 不可空缺'),
    check('product_price')
        .trim()
        .notEmpty().withMessage('* 不可空缺')
        .isFloat().withMessage('* 只允許輸入數字'),
    check('product_member_price')
        .trim()
        .notEmpty().withMessage('* 不可空缺')
        .isFloat().withMessage('* 只允許輸入數字'),
    check('product_stock')
        .trim()
        .notEmpty().withMessage('* 不可空缺')
        .isInt().withMessage('* 只允許輸入數字'),
    check('category_id')
        .trim()
        .notEmpty().withMessage('* 不可空缺'),
    check('product_rating')
        .trim()
        .notEmpty().withMessage('* 不可空缺')
        .isInt(),
    check('product_description')
        .trim()
        .notEmpty().withMessage('* 不可空缺'),

    (req, res, next) => {

        req.session.product_info = req.body;

        const errors = validationResult(req);
        const modified_errors = errors.array().map((obj) => {
            return Object.assign(obj, { type: `error` });
        })
        if (!errors.isEmpty()) {
            req.flash(`validation`, modified_errors);
            req.session.save(function (err) {
                if (req.params.id) {
                    res.redirect('/api/product/' + req.params.id);
                } else {
                    res.redirect('/api/product/new');
                }
            })
        } else return next();
    }
]