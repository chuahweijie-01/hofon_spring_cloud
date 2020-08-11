const bcrypt = require('bcrypt');
const client_model = require('../../model/admin/client');

function privileges_check(privileges) {
    if (privileges == null) {
        privileges = ['1'];
    } else {
        privileges.push('1');
    }

    return privileges;
}

exports.client_create = (req, res) => {

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
                company_id: req.session.company_id,
            }
        }

        client_model.add_client(client_info, req.body.privileges_id).then((result) => {
            req.flash('flash', {
                'msg': result,
                'type': 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/client');
            })
        }).catch((err) => {
            req.flash('flash', {
                'msg': err,
                'type': 'error'
            });
            req.session.save(function (err) {
                res.redirect('/api/client');
            })
        })
    })
}

exports.client_display = (req, res) => {
    client_model.get_privileges().then((privileges) => {
        client_model.client(req.params.id).then((result) => {
            console.log(result)
            res.render('client_edit', {
                title: "管理者",
                icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/client">管理者</a></li><li class="active">更新管理者</li>',
                message: req.flash('flash'),
                data: result,
                privileges: privileges
            });
        }).catch((err) => {

        })
    }).catch((err) => {

    })
}

exports.client_display_list = (req, res) => {
    if (req.session.role == 1) {
        client_model.client_list().then((result) => {
            res.render('client', {
                title: "管理者",
                icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">管理者</li>',
                message: req.flash('flash'),
                data: result
            });
        }).catch((err) => {
            res.render('client', {
                title: "管理者",
                icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">管理者</li>',
                message: req.flash('flash'),
                data: ''
            });
        })
    } else {
        console.log(req.session.company)
        client_model.client_list_company(req.session.company).then((result) => {
            res.render('client', {
                title: "管理者",
                icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">管理者</li>',
                message: req.flash('flash'),
                data: result
            });
        }).catch((err) => {
            res.render('client', {
                title: "管理者",
                icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">管理者</li>',
                message: req.flash('flash'),
                data: ''
            });
        })
    }
}

exports.client_new = (req, res) => {
    client_model.get_company_name().then((company) => {
        client_model.get_privileges().then((privileges) => {
            res.render('client_add', {
                title: "管理者",
                icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/client">管理者</a></li><li class="active">新增管理者</li>',
                message: req.flash('flash'),
                data: company,
                privileges: privileges
            });
        }).catch((err) => {
            res.render('client_add', {
                title: "管理者",
                icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/client">管理者</a></li><li class="active">新增管理者</li>',
                message: req.flash('flash'),
                data: ''
            });
        })
    }).catch((err) => {
        res.render('client_add', {
            title: "管理者",
            icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/client">管理者</a></li><li class="active">新增管理者</li>',
            message: req.flash('flash'),
            data: ''
        });
    })
}


exports.client_update = (req, res) => {

    client_id = req.params.id;

    client_info = {
        admin_email : req.body.admin_email,
        admin_name: req.body.admin_name,
    }

    client_model.client_update(client_id, client_info, req.body.privileges_id).then((result) => {
        req.flash('flash', {
            'msg': result,
            'type': 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/client');
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err,
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
            'msg': err,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/client');
        })
    })
}



