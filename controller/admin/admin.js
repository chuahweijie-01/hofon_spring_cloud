const admin_model = require('../../model/admin')

exports.admin_create = function(req, res){
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

exports.admin_display = function(req, res){
    
}

exports.admin_display_list = function(req, res){
    res.render('admin',{
        user: req.session.username,
        title: "管理者"
    });
}

exports.admin_new = function(req, res){
    res.render('admin_modify',{
        user: req.session.username,
        title: "管理者",
        message: req.flash('error')
    });
}


exports.admin_update = function(req, res){
    
}

exports.admin_delete = function(req, res){
    
}


