const { check, validationResult } = require('express-validator');

exports.zoneInputValidation = [
    check('zone_name')
        .trim()
        .notEmpty().withMessage('* 不可空缺'),
    check('zone_charge')
        .trim()
        .notEmpty().withMessage('* 不可空缺')
        .isInt().withMessage('* 運費價格只允許輸入整數'),
    check('city_id')
        .notEmpty().withMessage('* 不可空缺'),
    (req, res, next) => {
        req.session.zoneInput = req.body;
        const errors = validationResult(req);
        const modified_errors = errors.array().map((obj) => {
            return Object.assign(obj, { type: 'error' });
        })
        if (!errors.isEmpty()) {
            req.flash('validation', modified_errors);
            req.session.save((err) => {
                if (req.params.id) res.redirect(`/api/zone/${req.params.id}`);
                else res.redirect('/api/zone/new');
            })
        } else return next();
    }
]