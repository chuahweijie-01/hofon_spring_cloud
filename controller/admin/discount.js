const discount_model = require('../../model/admin/discount')

exports.discount_create = (req, res) => {
    var product_id;
    Array.isArray(req.body.product_id) ? product_id = req.body.product_id : product_id = [req.body.product_id];
    discount_info = {
        company_id: req.session.company,
        discount_name: req.body.discount_name,
        discount_percent: req.body.discount_percent
    }
    discount_model.discount_create(discount_info, product_id)
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/discount');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/discount');
            })
        })
}

exports.discount_display = (req, res) => {
    var product_info, discount_info;
    discount_model.product_list(req.session.company)
        .then((result) => {
            product_info = result;
            return discount_model.discount_display(req.params.id)
        })
        .then((result) => {
            discount_info = result;
            res.render('discount_edit', {
                title: "促銷",
                icon: '<span class="glyphicon glyphicon-gift" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/discount">促銷管理</a></li><li class="active">更新促銷</li>',
                message: req.flash(`flash`),
                data: discount_info,
                product: product_info
            });
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message,
                type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/discount');
            })
        })
}

exports.discount_display_list = (req, res) => {
    discount_model.discount_display_list(req.session.company, req.query)
        .then((result) => {
            res.render('discount', {
                title: "促銷",
                icon: '<span class="glyphicon glyphicon-gift" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">促銷</li>',
                message: req.flash(`flash`),
                data: result.rows,
                pagination: result.pagination,
                pagination_path: 'discount'
            });
        }).catch((err) => {
            req.flash(`flash`, {
                msg: err.message,
                type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/dashboard');
            })
        })
}

exports.discount_new = (req, res) => {
    discount_model.product_list(req.session.company)
        .then((result) => {
            res.render('discount_add', {
                title: "促銷",
                icon: '<span class="glyphicon glyphicon-gift" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/discount">促銷管理</a></li><li class="active">新增促銷</li>',
                message: req.flash(`flash`),
                data: result
            });
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err,
                type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/discount');
            })
        })
}


exports.discount_update = (req, res) => {
    var product_id;
    Array.isArray(req.body.product_id) ? product_id = req.body.product_id : product_id = [req.body.product_id];
    discount_info = {
        discount_name: req.body.discount_name,
        discount_percent: req.body.discount_percent
    }
    discount_model.discount_update(discount_info, req.params.id, product_id)
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/discount');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/discount');
            })
        })
}

exports.discount_delete = (req, res) => {
    discount_model.discount_delete(req.params.id)
        .then((result) => {
            req.flash(`flash`, {
                msg: result,
                type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/discount');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err,
                type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/discount');
            })
        })
}


