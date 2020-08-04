const discount_model = require('../../model/discount')

exports.discount_create = function(req, res){
    var insertValues = 'Entering';
    discount_model.addDiscount(insertValues).then((result) => {
        req.flash('success', "資料更新成功");
        res.redirect('/api/discount/new');
    }).catch((err) => {
        req.flash('error', "數據庫並未連接");
        req.session.save(function (err) {
            res.redirect('/api/discount/new');
        })
    })
}

exports.discount_display = function(req, res){
    
}

exports.discount_display_list = function(req, res){
    res.render('discount',{
        user: req.session.username,
        title: "促銷"
    });
}

exports.discount_new = function(req, res){
    res.render('discount_modify',{
        user: req.session.username,
        title: "促銷",
        message: req.flash('error')
    });
}


exports.discount_update = function(req, res){
    
}

exports.discount_delete = function(req, res){
    
}


