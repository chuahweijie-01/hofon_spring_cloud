const product_model = require('../model/product')

exports.product_create = function(req, res){
    var insertValues = 'Entering';
    product_model.addProduct(insertValues).then((result) => {
        req.flash('success', "資料更新成功");
        res.redirect('/api/product/new');
    }).catch((err) => {
        req.flash('error', "數據庫並未連接");
        res.redirect('/api/product/new');
    })
}

exports.product_display = function(req, res){

}

exports.product_display_list = function(req, res){
    res.render('product',{
        user: req.session.email,
        title: "產品"
    });
}

exports.product_new = function(req, res){
    res.render('product_modify',{
        user: req.session.email,
        title: "產品"
    });

}

exports.product_update = function(req, res){

}

exports.product_delete = function(req, res){

}
