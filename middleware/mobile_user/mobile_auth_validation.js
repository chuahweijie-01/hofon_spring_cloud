const { check, validationResult } = require('express-validator');

exports.user_info_input = [
    check('user_email')
        .notEmpty().withMessage('* 不可空缺')
        .isEmail().withMessage('* 請輸入正確的郵箱格式'),
    check('user_password')
        .notEmpty().withMessage('* 不可空缺'),

    (req, res, next) => {
        const errors = validationResult(req);
        const modified_errors = errors.array({ onlyFirstError: true}).map((obj) => {
            return Object.assign(obj, { type: `error` });
        })
        if (!errors.isEmpty()) {
            res.status(404).send(modified_errors);
        } else return next();
    }
]