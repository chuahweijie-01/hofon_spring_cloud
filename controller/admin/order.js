const order_model = require('../../model/admin/order')

exports.order_create = (req, res) => {

}

exports.getOrder = (req, res) => {
    order_model.getOrder(req.params.id, req.session.company)
        .then((result) => {
            res.render('order_view', {
                title: "訂單生成",
                icon: '<span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/order">訂單生成</a></li><li class="active">訂單詳情</li>',
                message: req.flash(`flash`),
                data: result
            });
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/order');
            })
        })
}

exports.getOrderList = (req, res) => {
    order_model.getOrderList(req.session.company, req.query)
        .then((result) => {
            res.render('order', {
                title: "訂單生成",
                data: result.rows,
                pagination_path: 'order',
                message: req.flash(`flash`),
                pagination: result.pagination,
                icon: '<span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">訂單生成</li>',
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
        title: "訂單生成",
        icon: '<span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/order">訂單生成</a></li><li class="active">訂單詳情</li>'
    });
}


exports.updateOrder = (req, res) => {
    order_model.updateOrder(req.params.id)
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect(`/api/order`);
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect(`/api/order/${req.params.id}`);
            })
        })
}

exports.order_delete = (req, res) => {

}


