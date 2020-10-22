const category_model = require('../../model/admin/category')

exports.addNewCategory = (req, res) => {

    var company_id;
    category_name = req.body.category_name;
    Array.isArray(req.body.company_id) ? company_id = req.body.company_id : company_id = [req.body.company_id];

    category_model.addNewCategory(category_name, company_id)
        .then((result) => {
            req.flash(`flash`, {
                msg: result,
                type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/category');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message,
                type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/category');
            })
        })
}

exports.getCategory = (req, res) => {
    category_model.getCompanyList().then((company) => {
        category_model.getCategory(req.params.id).then((category) => {
            var category_info = req.session.category_info;
            req.session.category_info = null;
            res.render('category_edit', {
                title: "產品屬性",
                icon: '<span class="glyphicon glyphicon-search" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/category">產品屬性</a></li><li class="active">更新產品屬性</li>',
                message: req.flash(`flash`),
                validation: req.flash(`validation`),
                category_info: category_info,
                data: category,
                company: company
            });
        }).catch((err) => {
            req.flash(`flash`, {
                msg: err.message,
                type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/category');
            })
        })
    }).catch((err) => {
        req.flash(`flash`, {
            msg: err.message,
            type: `error`
        });
        req.session.save(function (err) {
            res.redirect('/api/category');
        })
    })

}

exports.getCategoryList = (req, res) => {
    category_model.getCategoryList(req.query)
        .then((result) => {
            res.render('category', {
                title: "產品屬性",
                icon: '<span class="glyphicon glyphicon-search" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">產品屬性</li>',
                message: req.flash(`flash`),
                data: result.rows,
                pagination: result.pagination,
                pagination_path: 'category'
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

exports.category_new = (req, res) => {
    category_model.getCompanyList()
        .then((result) => {
            var category_info = req.session.category_info;
            req.session.category_info = null;
            res.render('category_add', {
                title: "產品屬性",
                icon: '<span class="glyphicon glyphicon-search" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/category">產品屬性</a></li><li class="active">新增產品屬性</li>',
                message: req.flash(`flash`),
                validation: req.flash(`validation`),
                category_info: category_info,
                data: result
            });
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message,
                type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/category');
            })
        })
}

exports.updateCategory = (req, res) => {

    category_info = {
        category_id: req.params.id,
        category_name: req.body.category_name
    }

    var company_id;
    Array.isArray(req.body.company_id) ? company_id = req.body.company_id : company_id = [req.body.company_id];

    category_model.updateCategory(category_info, company_id)
        .then((result) => {
            req.flash(`flash`, {
                msg: result,
                type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/category');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message,
                type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/category');
            })
        })
}

exports.deleteCategory = (req, res) => {
    category_model.deleteCategory(req.params.id)
        .then((result) => {
            req.flash(`flash`, {
                msg: result,
                type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/category');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message,
                type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/category');
            })
        })
}


