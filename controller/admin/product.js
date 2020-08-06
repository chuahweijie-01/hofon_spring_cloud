const product_model = require('../../model/admin/product')

exports.product_create = (req, res) => {
    var insertValues = 'Entering';
    product_model.addProduct(insertValues).then((result) => {
        req.flash('success', "資料更新成功");
        res.redirect('/api/product/new');
    }).catch((err) => {
        req.flash('error', "數據庫並未連接");
        req.session.save(function (err) {
            res.redirect('/api/product/new');
        })
    })
}

exports.product_display = (req, res) => {

}

exports.product_display_list = (req, res) => {
    res.render('product', {
        user: req.session.username,
        title: "產品",
        icon: '<span class="glyphicon glyphicon-book" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">產品</li>'
    });
}

exports.product_new = (req, res) => {
    res.render('product_modify', {
        user: req.session.username,
        title: "產品",
        icon: '<span class="glyphicon glyphicon-book" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/product">產品</a></li><li class="active">新增產品</li>',
        message: req.flash('error')
    });

}

exports.product_update = (req, res) => {

}

exports.product_delete = (req, res) => {

}
