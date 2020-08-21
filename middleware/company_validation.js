const { check, validationResult } = require('express-validator');

exports.company_info_input = [
    check('company_contact_name')
        .notEmpty().withMessage('* 不可空缺'),
    check('company_contact_position')
        .notEmpty().withMessage('* 不可空缺'),
    check('company_contact_phone')
        .notEmpty().withMessage('* 不可空缺'),
    check('company_contact_fax')
        .notEmpty().withMessage('* 不可空缺'),
    check('company_name')
        .notEmpty().withMessage('* 不可空缺'),
    check('company_official_id')
        .notEmpty().withMessage('* 不可空缺')
        .isLength({ min: 6, max: 6 }).withMessage('* 統編只允許六碼'),
    check('company_phone')
        .notEmpty().withMessage('* 不可空缺'),
    check('company_description')
        .notEmpty().withMessage('* 不可空缺'),
    check('company_address')
        .notEmpty().withMessage('* 不可空缺'),
    check('company_address_another')
        .notEmpty().withMessage('* 不可空缺'),
    check('company_bank_account')
        .notEmpty().withMessage('* 不可空缺'),
    check('company_bank_account_holder')
        .notEmpty().withMessage('* 不可空缺'),
    check('company_bank_name')
        .notEmpty().withMessage('* 不可空缺'),
    check('company_bank_name_code')
        .notEmpty().withMessage('* 不可空缺')
        .isLength({ min: 3, max: 3 }).withMessage('* 代號只允許三碼'),
    check('company_bank_branch')
        .notEmpty().withMessage('* 不可空缺'),
    check('company_bank_branch_code')
        .notEmpty().withMessage('* 不可空缺')
        .isLength({ min: 4, max: 4 }).withMessage('* 代號只允許四碼'),

    (req, res, next) => {
        req.session.company_info = req.body;
        const errors = validationResult(req);
        const modified_errors = errors.array().map((obj) => {
            return Object.assign(obj, { type: 'error' });
        })
        if (!errors.isEmpty()) {
            req.flash('validation', modified_errors);
            if (req.params.id) {
                req.session.save(function (err) {
                    res.redirect('/api/company/' + req.params.id);
                })
            } else {
                req.session.save(function (err) {
                    res.redirect('/api/company/new');
                })
            }
        } else return next();
    }
]

exports.company_info_input_client = [
    check('company_description')
        .notEmpty().withMessage('* 不可空缺'),

    (req, res, next) => {
        req.session.company_info = req.body.company_description;
        const errors = validationResult(req);
        const modified_errors = errors.array().map((obj) => {
            return Object.assign(obj, { type: 'error' });
        })
        if (!errors.isEmpty()) {
            req.flash('validation', modified_errors);
            req.session.save(function (err) {
                res.redirect('/api/company/' + req.params.id);
            })

        } else return next();
    }
]