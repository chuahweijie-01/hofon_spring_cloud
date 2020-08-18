const { check, validationResult } = require('express-validator');

exports.checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/')
}

exports.checkNotAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next()
    }
    res.redirect('/api/dashboard')
}

exports.checkUserRole = (req, res, next) => {
    if (req.session.role == 0) {
        res.redirect('/api/company/' + req.session.company)
    } else {
        next()
    }
}

exports.loginFormValidate = [
    check('username')
        //.isEmail().withMessage('請輸入正確的郵件格式')
        .notEmpty().withMessage('請輸入登入信息'),

    check('password')
        //.isLength({ min: 5 }).withMessage('密碼長度不足')
        .notEmpty().withMessage('請輸入密碼'),

    (req, res, next) => {
        const errors = validationResult(req);

        const modified_errors = errors.array().map((obj) => {
            return Object.assign(obj, { type: 'error' });
        })

        if (!errors.isEmpty()) {
            req.flash('flash', modified_errors);
            req.session.save(function (err) {
                res.redirect('/');
            })
        } else {
            return next();
        }
    }
]

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
        .isLength({ min: 3, max: 3 }).withMessage('* 代號只允許四碼'),
    check('company_bank_branch')
        .notEmpty().withMessage('* 不可空缺'),
    check('company_bank_branch_code')
        .notEmpty().withMessage('* 不可空缺')
        .isLength({ min: 4, max: 4 }).withMessage('* 代號只允許三碼'),

    (req, res, next) => {
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
        } else {
            return next();
        }
    }
]

exports.company_info_input_client = [

    check('company_description')
        .notEmpty().withMessage('* 不可空缺'),

    (req, res, next) => {
        const errors = validationResult(req);
        const modified_errors = errors.array().map((obj) => {
            return Object.assign(obj, { type: 'error' });
        })

        if (!errors.isEmpty()) {
            req.flash('validation', modified_errors);
            req.session.save(function (err) {
                res.redirect('/api/company/' + req.params.id);
            })

        } else {
            return next();
        }
    }
]

exports.client_info_input = [

    check('privileges_id')
        .notEmpty().withMessage('* 權限不可空缺'),

    (req, res, next) => {
        const errors = validationResult(req);

        const modified_errors = errors.array().map((obj) => {
            return Object.assign(obj, { type: 'error' });
        })

        if (!errors.isEmpty()) {
            req.flash('validation', modified_errors);
            req.session.save(function (err) {
                res.redirect('/api/client/new');
            })
        } else {
            return next();
        }
    }
]