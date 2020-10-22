const bcrypt = require('bcrypt');
const admin_model = require('../../model/admin/admin')

exports.addNewAdmin = (req, res) => {
    var adminPassword = req.body.admin_password;
    var adminEmail = req.body.admin_email;
    var adminName = req.body.admin_name;
    bcrypt.hash(adminPassword, 10, (err, hash) => {
        var adminInfo = {
            admin_email: adminEmail,
            admin_name: adminName,
            admin_password: hash,
            company_id: 1,
            admin_role: 1
        }
        admin_model.addNewAdmin(adminInfo)
            .then((result) => {
                req.flash(`flash`, {
                    msg: result, type: 'success'
                });
                req.session.save(function (err) {
                    res.redirect('/api/admin');
                })
            })
            .catch((err) => {
                req.flash(`flash`, {
                    msg: err.message, type: `error`
                });
                req.session.save(function (err) {
                    res.redirect('/api/admin');
                })
            })
    })
}

exports.getAdmin = (req, res) => {
    var adminId = req.params.id;
    admin_model.getAdmin(adminId)
        .then((result) => {
            var adminInput = req.session.adminInput;
            req.session.adminInput = null;
            res.render('admin_edit', {
                title: "禾豐春總管",
                icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/admin">禾豐春總管</a></li><li class="active">更新禾豐春總管</li>',
                message: req.flash(`flash`),
                validation: req.flash(`validation`),
                data: result,
                admin_info: adminInput
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/admin');
            })
        })
}

exports.getAdminList = (req, res) => {
    var pageInfo = req.query;
    admin_model.getAdminList(pageInfo)
        .then((result) => {
            res.render('admin', {
                title: "禾豐春總管",
                icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">禾豐春總管</li>',
                message: req.flash(`flash`),
                data: result.rows,
                pagination: result.pagination,
                pagination_path: 'admin'
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

exports.addNewAdminPage = (req, res) => {
    var adminInput = req.session.adminInput;
    req.session.adminInput = null;
    res.render('admin_add', {
        title: "禾豐春總管",
        icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/admin">禾豐春總管</a></li><li class="active">新增禾豐春總管</li>',
        message: req.flash(`flash`),
        validation: req.flash(`validation`),
        admin_info: adminInput
    });
}


exports.updateAdmin = (req, res) => {
    var adminId = req.params.id;
    var adminEmail = req.body.admin_email;
    var adminName = req.body.admin_name;
    var adminInfo = {
        admin_name: adminName,
        admin_email: adminEmail
    }
    admin_model.updateAdmin(adminId, adminInfo)
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/admin');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/admin');
            })
        })
}

exports.deleteAdmin = (req, res) => {
    var adminId = req.params.id;
    admin_model.deleteAdmin(adminId)
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/admin');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/admin');
            })
        })
}


