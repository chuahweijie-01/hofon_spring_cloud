const bcrypt = require('bcrypt');

exports.login_page = (req, res) => {
    res.render('login', {
        title: "登入頁面",
        message: req.flash('error')
    });
}

exports.logout = (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    })
}

exports.loginFailed = (req, res) => {
    if (!req.user) {
        req.flash('error', {'msg' : '登入失敗，請重新登入'});
        req.session.save(function (err) {
            res.redirect('/');
        })
    }
}

exports.auth = (req, res) => {
    req.session.loggedin = true;
    req.session.username = req.body.username;
    req.session.save(function (err) {
        res.redirect('/api/dashboard');
    })
}