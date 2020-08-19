const bcrypt = require('bcrypt');
const admin_model = require('../../model/admin/admin')

exports.admin_create = (req, res) => {
    bcrypt.hash(req.body.admin_password, 10, (err, hash) => {
        admin_info = {
            admin_email: req.body.admin_email,
            admin_name: req.body.admin_name,
            admin_password: hash,
            company_id: 1,
            admin_role: 1
        }

        admin_model.admin_create(admin_info).then((result) => {
            req.flash('flash', { 'msg': result, 'type': 'success' });
            req.session.save(function (err) {
                res.redirect('/api/admin');
            })
        }).catch((err) => {
            req.flash('flash', { 'msg': err.message, 'type': 'error' });
            req.session.save(function (err) {
                res.redirect('/api/admin');
            })
        })
    })
}

exports.admin_display = (req, res) => {
    admin_model.admin_display(req.params.id).then((result) => {
        var admin_info = req.session.admin_info;
        req.session.admin_info = null;

        res.render('admin_edit', {
            title: "禾豐春總管",
            icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/admin">禾豐春總管</a></li><li class="active">更新禾豐春總管</li>',
            message: req.flash('flash'),
            validation: req.flash('validation'),
            data: result,
            admin_info: admin_info
        })
    }).catch((err) => {
        req.flash('flash', { 'msg': err.message, 'type': 'error' });
        req.session.save(function (err) {
            res.redirect('/api/admin');
        })
    })
}

exports.admin_display_list = (req, res) => {
    admin_model.admin_display_list().then((result) => {
        res.render('admin', {
            title: "禾豐春總管",
            icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">禾豐春總管</li>',
            message: req.flash('flash'),
            data: result
        });
    }).catch((err) => {
        req.flash('flash', { 'msg': err.message, 'type': 'error' });
        req.session.save(function (err) {
            res.redirect('/api/dashboard');
        })
    })
}

exports.admin_new = (req, res) => {
    var admin_info = req.session.admin_info;
    req.session.admin_info = null;
    res.render('admin_add', {
        title: "禾豐春總管",
        icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/admin">禾豐春總管</a></li><li class="active">新增禾豐春總管</li>',
        message: req.flash('flash'),
        validation: req.flash('validation'),
        admin_info: admin_info
    });
}


exports.admin_update = (req, res) => {
    admin_info = {
        admin_name: req.body.admin_name,
        admin_email: req.body.admin_email
    }

    admin_model.admin_update(req.params.id, admin_info).then((result) => {
        req.flash('flash', { 'msg': result, 'type': 'success' });
        req.session.save(function (err) {
            res.redirect('/api/admin');
        })
    }).catch((err) => {
        req.flash('flash', { 'msg': err.message, 'type': 'error' });
        req.session.save(function (err) {
            res.redirect('/api/admin');
        })
    })
}

exports.admin_delete = (req, res) => {
    admin_model.admin_delete(req.params.id).then((result) => {
        req.flash('flash', { 'msg': result, 'type': 'success' });
        req.session.save(function (err) {
            res.redirect('/api/admin');
        })
    }).catch((err) => {
        req.flash('flash', { 'msg': err.message, 'type': 'error' });
        req.session.save(function (err) {
            res.redirect('/api/admin');
        })
    })
}


