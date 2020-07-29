const Web_Model = require("../model/web_auth");

exports.login_page = function(req, res){
    if(req.session.email){
        res.redirect('/api/dashboard');
    } else{
        res.render('login');
    }
}

exports.login = function(req, res){
    var dbemail = '123';
    var dbpassword = '123';
    var email = req.body.email;
    var password = req.body.password;

    if( email === '' || password === ''){
        req.flash('error', "Please enter your login information.");
        res.redirect('/');
    } else if(email === dbemail && password === dbpassword){
        req.session.email = email;
        req.session.password = password;
        //res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.redirect('/api/dashboard');
    } else{
        req.flash('error', "Login Failed ! Please try again.");
        res.redirect('/');
    }
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