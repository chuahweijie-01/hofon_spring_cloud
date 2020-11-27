const bcrypt = require('bcrypt');
const client_model = require('../../model/admin/client');
const UUID = require('uuid');

exports.addNewClient = (req, res) => {
    var privileges_id, client_info;
    var clientId = UUID.v4();
    Array.isArray(req.body.privileges_id) ? privileges_id = req.body.privileges_id : privileges_id = [req.body.privileges_id];

    bcrypt.hash(req.body.admin_password, 10, (err, hash) => {
        if (req.session.isAdmin) {
            client_info = {
                admin_id: clientId,
                admin_email: req.body.admin_email,
                admin_name: req.body.admin_name,
                admin_password: hash,
                company_id: req.body.company_id,
            }
        } else {
            client_info = {
                admin_id: clientId,
                admin_email: req.body.admin_email,
                admin_name: req.body.admin_name,
                admin_password: hash,
                company_id: req.session.company,
            }
        }

        client_model.addNewClient(client_info, privileges_id)
            .then((result) => {
                req.flash(`flash`, {
                    msg: result, type: 'success'
                });
                req.session.save(function (err) {
                    res.redirect('/api/client');
                })
            })
            .catch((err) => {
                req.flash(`flash`, {
                    msg: err.message, type: `error`
                });
                req.session.save(function (err) {
                    res.redirect('/api/client');
                })
            })
    })
}

exports.getClient = (req, res) => {
    var privileges_info;
    client_model.getPrivilegesList()
        .then((result) => {
            privileges_info = result;
            return client_model.getClient(req.params.id)
        })
        .then((result) => {
            var client_info = req.session.client_info;
            req.session.client_info = null;
            res.render('client_edit', {
                title: "管理者",
                icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/client">管理者</a></li><li class="active">更新管理者</li>',
                message: req.flash(`flash`),
                validation: req.flash(`validation`),
                data: result,
                privileges: privileges_info,
                client_info: client_info
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/client');
            })
        })
}

exports.getClientList = (req, res) => {
    client_model.getClientList(req.session.isAdmin, req.session.company, req.query)
        .then((result) => {
            res.render('client', {
                title: "管理者",
                icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">管理者</li>',
                message: req.flash(`flash`),
                data: result.rows,
                pagination: result.pagination,
                pagination_path: 'client'
            });
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/dashboard');
            })
        })
}

exports.client_new = (req, res) => {
    var company_info, privileges_info;
    client_model.getCompanyList()
        .then((result) => {
            company_info = result;
            return client_model.getPrivilegesList();
        })
        .then((result) => {
            privileges_info = result;
            var client_info = req.session.client_info;
            req.session.client_info = null;
            res.render('client_add', {
                title: "管理者",
                icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/client">管理者</a></li><li class="active">新增管理者</li>',
                message: req.flash(`flash`),
                validation: req.flash(`validation`),
                data: company_info,
                privileges: privileges_info,
                client_info: client_info
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/client');
            });
        });
}


exports.updateClient = (req, res) => {
    var privileges_id;
    Array.isArray(req.body.privileges_id) ? privileges_id = req.body.privileges_id : privileges_id = [req.body.privileges_id];

    var client_info = {
        admin_email: req.body.admin_email,
        admin_name: req.body.admin_name,
    }

    client_model.updateClient(req.params.id, client_info, privileges_id, req.session.company)
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/client');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/client');
            })
        })
}

exports.deleteClient = (req, res) => {
    client_model.deleteClient(req.params.id, req.user)
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/client');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/client');
            })
        })
}



