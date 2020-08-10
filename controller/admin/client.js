const admin_model = require('../../model/admin/client')

exports.client_create = (req, res) => {
    var insertValues = 'Entering';
    admin_model.addClient(insertValues).then((result) => {
        req.flash('flash', {
            'msg' : '注冊成功',
            'type': 'success'
        });
        res.redirect('/api/client/new');
    }).catch((err) => {
        req.flash('flash', {
            'msg' : '數據庫並未連接',
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/client/new');
        })
    })
}

exports.client_display = (req, res) => {
    
}

exports.client_display_list = (req, res) => {
    res.render('client',{
        title: "管理者",
        icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">管理者</li>'
    });
}

exports.client_new = (req, res) => {
    res.render('client_modify',{
        title: "管理者",
        icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/client">管理者</a></li><li class="active">新增管理者</li>',
        message: req.flash('flash')
    });
}


exports.client_update = (req, res) => {
    
}

exports.client_delete = (req, res) => {
    
}


