const { check, validationResult } = require('express-validator');

exports.userRegistrationInput = [
    check('user_email')
        .notEmpty().withMessage('* 不可空缺')
        .isEmail().withMessage('* 請輸入正確的郵箱格式'),
    check('user_password')
        .notEmpty().withMessage('* 不可空缺')
        .isLength({ min: 10 }).withMessage('* 密碼長度需多餘10個字元')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
        .withMessage('* 密碼組合需英數混合 至少包含一個大小寫字母'),
    check('user_name')
        .notEmpty().withMessage('* 不可空缺'),
    check('user_birth_year')
        .notEmpty().withMessage('* 不可空缺'),
    check('user_birth_month')
        .notEmpty().withMessage('* 不可空缺')
        .isInt({ min: 1, max: 12 }).withMessage('請填寫正確的日期格式'),
    check('user_birth_day')
        .notEmpty().withMessage('* 不可空缺')
        .isInt({ min: 1, max: 31 }).withMessage('請填寫正確的日期格式'),
    check('user_gender')
        .notEmpty().withMessage('* 不可空缺'),
    check('company_official_id')
        .notEmpty().withMessage('* 不可空缺')
        .isLength({ min: 8, max: 10 }).withMessage('公司統編號碼需介於 8 至 10 個字數')
        .isInt().withMessage('請填寫正確的公司統編號碼'),

    (req, res, next) => {
        const errors = validationResult(req);
        const modified_errors = errors.array({ onlyFirstError: true }).map((obj) => {
            return Object.assign(obj.msg);
        })
        if (!errors.isEmpty()) {
            res.status(404).send(modified_errors);
        } else return next();
    }
]