const discount_model = require('../../model/admin/discount')

exports.discount_create = (req, res) => {

    discount_info = {
        company_id: req.session.company,
        discount_name: req.body.discount_name,
        discount_percent: req.body.discount_percent
    }

    req.flash('flash', {
        msg: 'API測試',
        type: 'success'
    });
    req.session.save(function (err) {
        res.redirect('/api/discount');
    })

    /*discount_model.discount_create(discount_info, req.body.product_id).then((result) => {
        req.flash('flash', {
            msg: result,
            type: 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/discount');
        })
    }).catch((err) => {
        req.flash('flash', {
            msg: err,
            type: 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/discount');
        })
    })*/
}

exports.discount_display = (req, res) => {
    /*discount_model.product_list(req.session.company).then((product) => {
        discount_model.discount_display(req.params.id).then((result) => {
            res.render('discount_edit', {
                title: "促銷",
                icon: '<span class="glyphicon glyphicon-gift" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/discount">促銷管理</a></li><li class="active">更新促銷</li>',
                message: req.flash('flash'),
                data: result,
                product: product
            });
        }).catch((err) => {
            req.flash('flash', {
                msg: err,
                type: 'error'
            });
            req.session.save(function (err) {
                res.redirect('/api/discount');
            })
        })
    }).catch((err) => {
        req.flash('flash', {
            msg: err,
            type: 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/discount');
        })
    })*/

    res.render('discount_edit', {
        title: "促銷",
        icon: '<span class="glyphicon glyphicon-gift" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/discount">促銷管理</a></li><li class="active">更新促銷</li>',
        message: req.flash('flash'),
        data: ''
    });
}

exports.discount_display_list = (req, res) => {
    /*discount_model.discount_display_list(req.session.company).then((result) => {
        res.render('discount', {
            title: "促銷",
            icon: '<span class="glyphicon glyphicon-gift" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">促銷</li>',
            message: req.flash('flash'),
            data: result
        });
    }).catch((err) => {
        req.flash('flash', {
            msg: err,
            type: 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/dashboard');
        })
    })*/
    res.render('discount', {
        title: "促銷",
        icon: '<span class="glyphicon glyphicon-gift" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">促銷</li>',
        message: req.flash('flash'),
        data: ''
    });
}

exports.discount_new = (req, res) => {
    /*discount_model.product_list(req.session.company).then((result) => {
        res.render('discount_add', {
            title: "促銷",
            icon: '<span class="glyphicon glyphicon-gift" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/discount">促銷管理</a></li><li class="active">新增促銷</li>',
            message: req.flash('flash'),
            data: result
        });
    }).catch((err) => {
        req.flash('flash', {
            msg: err,
            type: 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/discount');
        })
    })*/

    res.render('discount_add', {
        title: "促銷",
        icon: '<span class="glyphicon glyphicon-gift" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/discount">促銷管理</a></li><li class="active">新增促銷</li>',
        message: req.flash('flash'),
        data: ''
    });
}


exports.discount_update = (req, res) => {

    discount_info = {
        discount_name: req.body.discount_name,
        discount_percent: req.body.discount_percent
    }

    company_id = req.session.company;
    discount_id = req.params.id;

    req.flash('flash', {
        msg: 'API測試',
        type: 'success'
    });
    req.session.save(function (err) {
        res.redirect('/api/discount');
    })

    /*discount_model.discount_update(discount_info, discount_id, req.body.product_id).then((result) => {
        req.flash('flash', {
            msg: result,
            type: 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/discount');
        })
    }).catch((err) => {
        req.flash('flash', {
            msg: err,
            type: 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/discount');
        })
    })*/
}

exports.discount_delete = (req, res) => {
    req.flash('flash', {
        msg: 'API測試',
        type: 'success'
    });
    req.session.save(function (err) {
        res.redirect('/api/discount');
    })

    /*discount_model.discount_delete(req.params.id).then((result) => {
        req.flash('flash', {
            msg: result,
            type: 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/discount');
        })
    }).catch((err) => {
        req.flash('flash', {
            msg: err,
            type: 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/discount');
        })
    })*/
}


