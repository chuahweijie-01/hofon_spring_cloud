const admin_model = require('../../model/admin/admin')

exports.admin_create = (req, res) => {
    var insertValues = 'Entering';
    admin_model.add_admin(insertValues).then((result) => {
        req.flash('flash', {
            'msg': '注冊成功',
            'type': 'success'
        });
        res.redirect('/api/admin/new');
    }).catch((err) => {
        req.flash('flash', {
            'msg': '數據庫並未連接',
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/admin/new');
        })
    })
}

exports.admin_display = (req, res) => {

}

exports.admin_display_list = (req, res) => {
    admin_model.admin_list().then((result) => {
        console.log(result);
        res.render('admin', {
            title: "禾豐春總管",
            icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">禾豐春總管</li>'
        });
    }).catch((err) => {
        console.log(err);
        res.render('admin', {
            title: "禾豐春總管",
            icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">禾豐春總管</li>'
        });
    })
}

exports.admin_new = (req, res) => {
    res.render('admin_modify', {
        title: "禾豐春總管",
        icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/admin">禾豐春總管</a></li><li class="active">新增禾豐春總管</li>',
        message: req.flash('flash')
    });
}


exports.admin_update = (req, res) => {

}

exports.admin_delete = (req, res) => {

}


