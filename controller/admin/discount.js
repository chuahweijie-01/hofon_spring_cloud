const discount_model = require('../../model/admin/discount')

exports.addNewDiscount = (req, res) => {
    var product_id;
    Array.isArray(req.body.product_id) ? product_id = req.body.product_id : product_id = [req.body.product_id];
    discount_info = {
        company_id: req.session.company,
        discount_name: req.body.discount_name,
        discount_percent: req.body.discount_percent
    }
    discount_model.addNewDiscount(discount_info, product_id)
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

exports.getDiscount = (req, res) => {
    var product_info, discount_info;
    discount_model.getProductList(req.session.company)
        .then((result) => {
            product_info = result;
            return discount_model.getDiscount(req.params.id)
        })
        .then((result) => {
            discount_info = result;
            var discountInput = req.session.discountInput;
            req.session.discountInput = null;
            res.render('discount_edit', {
                title: "促銷",
                icon: '<span class="glyphicon glyphicon-gift" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/discount">促銷管理</a></li><li class="active">更新促銷</li>',
                message: req.flash(`flash`),
                validation: req.flash(`validation`),
                data: discount_info,
                product: product_info,
                discount_info : discountInput
            });
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/discount');
            })
        })
}

exports.getDiscountList = (req, res) => {
    discount_model.getDiscountList(req.session.company, req.query)
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
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/dashboard');
            })
        })
}

exports.discount_new = (req, res) => {
    discount_model.getProductList(req.session.company)
        .then((result) => {
            var discountInput = req.session.discountInput;
            req.session.discountInput = null;
            res.render('discount_add', {
                title: "促銷",
                icon: '<span class="glyphicon glyphicon-gift" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/discount">促銷管理</a></li><li class="active">新增促銷</li>',
                message: req.flash(`flash`),
                validation: req.flash(`validation`),
                data: result,
                discount_info : discountInput
            });
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/discount');
            })
        })
}


exports.updateDiscount = (req, res) => {
    var product_id;
    Array.isArray(req.body.product_id) ? product_id = req.body.product_id : product_id = [req.body.product_id];
    discount_info = {
        discount_name: req.body.discount_name,
        discount_percent: req.body.discount_percent
    }
    discount_model.updateDiscount(discount_info, req.params.id, product_id)
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

exports.deleteDiscount = (req, res) => {
    discount_model.deleteDiscount(req.params.id)
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
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/discount');
            })
        })
}


