const bcrypt = require('bcrypt');

exports.login_page = function(req, res){
    res.render('login', { message: req.flash('error') });
}

exports.logout = function(req, res){
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        } else{
            res.redirect('/');
        }
    })
}

exports.loginFailed = function (req, res) {
    if (!req.user) {
        req.flash('error', "登入失敗，請重新登入。");
        req.session.save(function (err) {
            res.redirect('/');
        })
    }
}

exports.auth = function (req, res) {
    req.session.loggedin = true;
    req.session.username = req.body.username;
    req.session.save(function (err) {
        res.redirect('/api/dashboard');
    })
}