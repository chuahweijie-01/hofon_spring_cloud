const category_model = require('../../model/admin/category')

exports.category_create = (req, res) => {
    category_name = req.body.category_name;
    company_id = req.body.company_id;

    category_model.category_create(category_name, company_id).then((result) => {
        req.flash('flash', {
            'msg': result,
            'type': 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/category');
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/category');
        })
    })
}

exports.category_display = (req, res) => {
    category_model.company_list().then((company) => {
        category_model.category_display(req.params.id).then((category) => {
            res.render('category_edit', {
                title: "類別",
                icon: '<span class="glyphicon glyphicon-search" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/category">類別</a></li><li class="active">更新類別</li>',
                message: req.flash('flash'),
                data: category,
                company: company
            });
        }).catch((err) => {
            req.flash('flash', {
                'msg': err.message,
                'type': 'error'
            });
            req.session.save(function (err) {
                res.redirect('/api/category');
            })
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/category');
        })
    })

}

exports.category_display_list = (req, res) => {
    category_model.category_display_list().then((result) => {
        res.render('category', {
            title: "類別",
            icon: '<span class="glyphicon glyphicon-search" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">類別</li>',
            message: req.flash('flash'),
            data: result
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

exports.category_new = (req, res) => {
    category_model.company_list().then((result) => {
        res.render('category_add', {
            title: "類別",
            icon: '<span class="glyphicon glyphicon-search" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/category">類別</a></li><li class="active">新增類別</li>',
            message: req.flash('flash'),
            data: result
        });
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/category');
        })
    })
}

exports.category_update = (req, res) => {
    
    category_info = {
        category_id: req.params.id,
        category_name: req.body.category_name
    }

    category_model.category_update(category_info, req.body.company_id).then((result) => {
        req.flash('flash', {
            'msg': result,
            'type': 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/category');
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/category');
        })
    })
}

exports.category_delete = (req, res) => {
    category_model.category_delete(req.params.id).then((result) => {
        req.flash('flash', {
            'msg': result,
            'type': 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/category');
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/category');
        })
    })
}


