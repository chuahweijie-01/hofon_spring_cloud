const order_model = require('../model/order')

exports.order_create = function(req, res){
    var insertValues = 'Entering';
    order_model.selectOrder(insertValues).then((result) => {
        res.redirect('/api/discount/new');
    }).catch((err) => {
        res.redirect('/api/discount/new');
    })
}

exports.order_display = function(req, res){
    
}

exports.order_display_list = function(req, res){
    res.render('order',{
        user: req.session.email,
        title: "訂單"
    });
}

exports.order_new = function(req, res){
    res.render('order_view',{
        user: req.session.email,
        title: "訂單"
    });
}


exports.order_update = function(req, res){
    
}

exports.order_delete = function(req, res){
    
}


