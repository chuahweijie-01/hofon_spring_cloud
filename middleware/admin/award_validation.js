const { check, validationResult } = require('express-validator');

exports.awardInputValidation = [
    check('award_name')
        .trim()
        .notEmpty().withMessage('* 不可空缺'),
    check('award_description')
        .trim()
        .notEmpty().withMessage('* 不可空缺'),
    check('product_id')
        .notEmpty().withMessage('* 不可空缺'),
    (req, res, next) => {
        req.session.awardInput = req.body;
        const errors = validationResult(req);
        const modified_errors = errors.array().map((obj) => {
            return Object.assign(obj, { type: 'error' });
        })
        if (!errors.isEmpty()) {
            req.flash('validation', modified_errors);
            req.session.save((err) => {
                if (req.params.id) res.redirect(`/api/award/${req.params.id}`);
                else res.redirect('/api/award/new');
            })
        } else return next();
    }
]