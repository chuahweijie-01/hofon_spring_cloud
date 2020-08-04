const category_model = require('../../model/category')

exports.category_create = function (req, res) {
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

exports.category_display = function (req, res) {

}

exports.category_display_list = function (req, res) {
    res.render('category', {
        user: req.session.username,
        title: "類別"
    });
}

exports.category_new = function (req, res) {
    res.render('category_modify', {
        user: req.session.username,
        title: "類別",
        message: req.flash('error')
    });
}


exports.category_update = function (req, res) {

}

exports.category_delete = function (req, res) {

}


