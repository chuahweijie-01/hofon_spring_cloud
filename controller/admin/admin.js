const admin_model = require('../../model/admin/admin')

exports.admin_create = (req, res) => {
    var insertValues = 'Entering';
    admin_model.addAdmin(insertValues).then((result) => {
        
        req.flash('success', "資料更新成功");
        res.redirect('/api/admin/new');
    }).catch((err) => {
        req.flash('error', "數據庫並未連接");
        req.session.save(function (err) {
            res.redirect('/api/admin/new');
        })
    })
}

exports.admin_display = (req, res) => {
    
}

exports.admin_display_list = (req, res) => {
    res.render('admin',{
        user: req.session.username,
        title: "管理者",
        icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">管理者</li>'
    });
}

exports.admin_new = (req, res) => {
    res.render('admin_modify',{
        user: req.session.username,
        title: "管理者",
        icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/admin">管理者</a></li><li class="active">新增管理者</li>',
        message: req.flash('error')
    });
}


exports.admin_update = (req, res) => {
    
}

exports.admin_delete = (req, res) => {
    
}


