const order_model = require('../../model/admin/order')

exports.order_create = (req, res) => {
    
}

exports.order_display = (req, res) => {
    
}

exports.order_display_list = (req, res) => {
    res.render('order',{
        user: req.session.username,
        title: "訂單",
        icon: '<span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">訂單</li>'
    });
}

exports.order_new = (req, res) => {
    res.render('order_view',{
        user: req.session.username,
        title: "訂單",
        icon: '<span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/order">訂單</a></li><li class="active">訂單詳情</li>'
    });
}


exports.order_update = (req, res) => {
    
}

exports.order_delete = (req, res) => {
    
}


