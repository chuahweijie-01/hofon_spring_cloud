const bcrypt = require('bcrypt');
const web_auth_model = require('../../model/admin/web_auth');

exports.login_page = (req, res) => {
    res.render('login', { title: "登入頁面", message: req.flash(`flash`) });
}

exports.logout = (req, res) => {
    res.locals = null;
    req.session.destroy(function (err) {
        if (err) console.log(err);
        else res.redirect('/');
    })
}

exports.loginFailed = (req, res) => {
    if (!req.user) {
        req.flash(`flash`, { msg: '登入失敗，請重新登入', type: `error` });
        req.session.save(function (err) {
            res.redirect('/');
        })
    }
}

exports.auth = (req, res) => {
    req.session.save(function (err) {
        res.redirect('/api/dashboard');
    });
}

exports.register_admin = (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        user = { company_id: 1, admin_email: req.body.username, admin_password: hash, admin_role: 1 };
        web_auth_model.insert(user)
            .then((result) => {
                req.flash(`flash`, { msg: result, type: 'success' });
                req.session.save(function (err) {
                    res.redirect('/');
                });
            })
            .catch((err) => {
                req.flash(`flash`, { msg: err.message, type: `error` });
                req.session.save(function (err) {
                    res.redirect('/register');
                })
            })
    })
}

exports.register_page = (req, res) => {
    res.render('register', { title: "注冊頁面", message: req.flash(`flash`) });
}