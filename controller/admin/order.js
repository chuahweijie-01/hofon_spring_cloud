const order_model = require('../../model/admin/order')

exports.order_create = (req, res) => {

}

exports.order_display = (req, res) => {

}

exports.order_display_list = (req, res) => {
    order_model.order_display_list(req.session.company)
        .then((result) => {
            console.log(result);
            res.render('order', {
                title: "訂單",
                icon: '<span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">訂單</li>'
            });
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message,
                type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/dashboard');
            })
        })

}

exports.order_new = (req, res) => {
    res.render('order_view', {
        title: "訂單",
        icon: '<span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/order">訂單</a></li><li class="active">訂單詳情</li>'
    });
}


exports.order_update = (req, res) => {

}

exports.order_delete = (req, res) => {

}


