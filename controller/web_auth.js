const bcrypt = require('bcrypt');

const web_auth_model = require("../model/web_auth");

exports.login_page = function(req, res){
    if(req.session.email){
        res.redirect('/api/dashboard');
    } else{
        res.render('login');
    }
}

exports.auth = function(req, res){
    web_auth_model.auth(req.body.email).then((resultdb) => {
        if(!resultdb || null){
            req.flash('error', "User not registered !");
            res.redirect('/');
        } else {
            bcrypt.compare(req.body.password, resultdb[0].password, function (err, result) {
                if(result == true){
                    req.session.loggedin = true;
                    req.session.email = resultdb[0].username;
                    req.session.save(function (err) {
                        res.redirect('/api/dashboard');
                    })
                } else {
                    req.flash('error', "Login Failed ! Please try again.");
                    res.redirect('/');
                }
            });
        }
    }).catch((err) => {
        console.log(err);
    })
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

exports.new_user = function(req, res){

}