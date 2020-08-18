const bcrypt = require('bcrypt');
const client_model = require('../../model/admin/client');

exports.client_create = (req, res) => {

    var privileges_id;
    Array.isArray(req.body.privileges_id)? privileges_id = req.body.privileges_id : privileges_id = [req.body.privileges_id];

    bcrypt.hash(req.body.admin_password, 10, (err, hash) => {

        client_info = {};

        if (req.session.role == 1) {
            client_info = {
                admin_email: req.body.admin_email,
                admin_name: req.body.admin_name,
                admin_password: hash,
                company_id: req.body.company_id,
            }
        } else {
            client_info = {
                admin_email: req.body.admin_email,
                admin_name: req.body.admin_name,
                admin_password: hash,
                company_id: req.session.company,
            }
        }


        client_model.client_create(client_info, privileges_id).then((result) => {
            req.flash('flash', {
                'msg': result,
                'type': 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/client');
            })
        }).catch((err) => {
            req.flash('flash', {
                'msg': err.message,
                'type': 'error'
            });
            req.session.save(function (err) {
                res.redirect('/api/client');
            })
        })
    })
}

exports.client_display = (req, res) => {
    client_model.privileges_list().then((privileges) => {
        client_model.client_display(req.params.id).then((result) => {
            res.render('client_edit', {
                title: "管理者",
                icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/client">管理者</a></li><li class="active">更新管理者</li>',
                message: req.flash('flash'),
                data: result,
                privileges: privileges
            });
        }).catch((err) => {
            req.flash('flash', {
                'msg': err.message,
                'type': 'error'
            });
            req.session.save(function (err) {
                res.redirect('/api/client');
            })
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/client');
        })
    })
}

exports.client_display_list = (req, res) => {
    client_model.client_display_list(req.session.role, req.session.company).then((result) => {
        res.render('client', {
            title: "管理者",
            icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">管理者</li>',
            message: req.flash('flash'),
            data: result
        });
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/dashboard');
        })
    })
}

exports.client_new = (req, res) => {
    client_model.company_list().then((company) => {
        client_model.privileges_list().then((privileges) => {
            res.render('client_add', {
                title: "管理者",
                icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/client">管理者</a></li><li class="active">新增管理者</li>',
                message: req.flash('flash'),
                validation: req.flash('validation'),
                data: company,
                privileges: privileges
            });
        }).catch((err) => {
            req.flash('flash', {
                'msg': err.message,
                'type': 'error'
            });
            req.session.save(function (err) {
                res.redirect('/api/client');
            })
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/client');
        })
    })
}


exports.client_update = (req, res) => {

    client_info = {
        admin_email: req.body.admin_email,
        admin_name: req.body.admin_name,
    }

    client_model.client_update(req.params.id, client_info, req.body.privileges_id).then((result) => {
        req.flash('flash', {
            'msg': result,
            'type': 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/client');
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/client');
        })
    })
}

exports.client_delete = (req, res) => {
    client_model.client_delete(req.params.id).then((result) => {
        req.flash('flash', {
            'msg': result,
            'type': 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/client');
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/client');
        })
    })
}



