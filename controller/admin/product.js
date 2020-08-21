const product_model = require('../../model/admin/product')

exports.product_create = (req, res) => {

    product_info = {
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        product_member_price: req.body.product_member_price,
        product_stock: req.body.product_stock,
        category_id: req.body.category_id,
        product_rating: req.body.product_rating,
        product_description: req.body.product_description,
        company_id: req.session.company,
        product_latest_price: req.body.product_price,
    }

    image_path = req.body.image_path;

    product_model.product_create(product_info).then((result) => {
        req.flash('flash', {
            'msg': result,
            'type': 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/product');
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/product');
        })
    })
}

exports.product_display = (req, res) => {
    product_model.category_list(req.session.company).then((category => {
        product_model.product(req.params.id, req.session.company).then((result) => {
            var product_info = req.session.product_info;
            req.session.product_info = null;
            res.render('product_edit', {
                title: "產品",
                icon: '<span class="glyphicon glyphicon-book" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/product">產品</a></li><li class="active">更新產品</li>',
                message: req.flash('flash'),
                validation: req.flash('validation'),
                data: result,
                category: category,
                product_info: product_info
            });
        }).catch((err) => {
            req.flash('flash', {
                'msg': err.message,
                'type': 'error'
            });
            req.session.save(function (err) {
                res.redirect('/api/product');
            })
        })
    })).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/product');
        })
    });
}

exports.product_publish = (req, res) => {
    product_model.product_publish(req.params.product_id, req.params.category_id, req.session.company).then((result) => {
        res.status(200).send(result);
    }).catch((err) => {
        res.status(404).send(err);
    })
}

exports.product_unpublish = (req, res) => {
    product_model.product_unpublish(req.params.product_id, req.session.company).then((result) => {
        res.status(200).send(result);
    }).catch((err) => {
        res.status(404).send(err);
    })
}

exports.product_display_list = (req, res) => {
    product_model.product_list(req.session.company, req.query).then((result) => {
        res.render('product', {
            title: "產品",
            icon: '<span class="glyphicon glyphicon-book" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">產品</li>',
            message: req.flash('flash'),
            data: result.rows,
            pagination: result.pagination
        });
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/dashboard');
        })
    })
}

exports.product_new = (req, res) => {
    product_model.category_list(req.session.company).then((result => {
        var product_info = req.session.product_info;
        req.session.product_info = null;
        res.render('product_add', {
            title: "產品",
            icon: '<span class="glyphicon glyphicon-book" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/product">產品</a></li><li class="active">新增產品</li>',
            message: req.flash('flash'),
            validation: req.flash('validation'),
            data: result,
            product_info: product_info
        });
    })).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/product');
        })
    })
}

exports.product_update = (req, res) => {
    product_id = req.params.id;

    product_info = {
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        product_member_price: req.body.product_member_price,
        product_stock: req.body.product_stock,
        category_id: req.body.category_id,
        product_rating: req.body.product_rating,
        product_description: req.body.product_description,
        product_latest_price: req.body.product_price,
    }

    product_model.product_update(product_id, product_info).then((result) => {
        req.flash('flash', {
            'msg': result,
            'type': 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/product');
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/product');
        })
    })
}

exports.product_delete = (req, res) => {
    product_model.product_delete(req.params.id).then((result) => {
        req.flash('flash', {
            'msg': result,
            'type': 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/product');
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/product');
        })
    })
}
