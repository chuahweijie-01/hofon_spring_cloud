const category_model = require('../../model/admin/category')

exports.category_create = (req, res) => {
    var insertValues = 'Entering';
    category_model.addCategory(insertValues).then((result) => {
        req.flash('success', "資料更新成功");
        res.redirect('/api/category/new');
    }).catch((err) => {
        req.flash('error', "數據庫並未連接");
        req.session.save(function (err) {
            res.redirect('/api/category/new');
        })
    })
}

exports.category_display = (req, res) => {

}

exports.category_display_list = (req, res) => {
    res.render('category', {
        user: req.session.username,
        title: "類別",
        icon: '<span class="glyphicon glyphicon-search" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">類別</li>'
    });
}

exports.category_new = (req, res) => {
    res.render('category_modify', {
        user: req.session.username,
        title: "類別",
        icon: '<span class="glyphicon glyphicon-search" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/category">類別</a></li><li class="active">新增類別</li>',
        message: req.flash('error')
    });
}


exports.category_update = (req, res) => {

}

exports.category_delete = (req, res) => {

}


