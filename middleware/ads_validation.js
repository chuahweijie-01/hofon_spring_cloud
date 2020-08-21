const { check, validationResult } = require('express-validator');

exports.ads_info_input = [
    check('advertisement_name')
        .trim()
        .notEmpty().withMessage('* 不可空缺'),
    check('advertisement_link')
        .trim()
        .notEmpty().withMessage('* 不可空缺')
        .isURL().withMessage('* 請輸入正確的URL格式'),

    (req, res, next) => {
        req.session.ads_info = req.body;
        const errors = validationResult(req);
        const modified_errors = errors.array().map((obj) => {
            return Object.assign(obj, { type: 'error' });
        })
        if (!errors.isEmpty()) {
            req.flash('validation', modified_errors);
            req.session.save(function (err) {
                if (req.params.id) {
                    res.redirect('/api/ads/' + req.params.id);
                } else {
                    res.redirect('/api/ads/new');
                }
            })
        } else return next();
    }
]