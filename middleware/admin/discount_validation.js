const { check, validationResult } = require('express-validator');

exports.discountInputValidation = [
    check('discount_name')
        .trim()
        .notEmpty().withMessage('* 不可空缺'),
    check('discount_percent')
        .trim()
        .notEmpty().withMessage('* 不可空缺')
        .isInt().withMessage('* 只允許輸入整數'),
    check('product_id')
        .notEmpty().withMessage('* 不可空缺'),
    (req, res, next) => {
        req.session.discountInput = req.body;
        const errors = validationResult(req);
        const modified_errors = errors.array().map((obj) => {
            return Object.assign(obj, { type: 'error' });
        })
        if (!errors.isEmpty()) {
            req.flash('validation', modified_errors);
            req.session.save((err) => {
                if (req.params.id) res.redirect(`/api/discount/${req.params.id}`);
                else res.redirect('/api/discount/new');
            })
        } else return next();
    }
]