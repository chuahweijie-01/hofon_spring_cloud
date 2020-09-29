const award_model = require('../../model/admin/award')

exports.award_create = (req, res) => {

    var product_id;
    Array.isArray(req.body.product_id) ? product_id = req.body.product_id : product_id = [req.body.product_id];

    award_info = {
        company_id: req.session.company,
        award_name: req.body.award_name,
        award_description: req.body.award_description
    }

    award_model.award_create(award_info, product_id)
        .then((result) => {
            req.flash(`flash`, {
                msg: '注冊成功',
                type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/award');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: '數據庫並未連接',
                type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/award');
            })
        })
}

exports.award_display = (req, res) => {
    var product_info;
    award_model.product_list(req.session.company)
        .then((product) => {
            product_info = product;
            return award_model.award_display(req.params.id)
        })
        .then((award) => {
            var award_info = req.session.award_info;
            req.session.award_info = null;
            res.render('award_edit', {
                title: "暢銷排行榜",
                icon: '<span class="glyphicon glyphicon-certificate" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/award">暢銷排行榜</a></li><li class="active">新增暢銷排行榜</li>',
                message: req.flash(`flash`),
                validation: req.flash(`validation`),
                data: award,
                product: product_info,
                award_info: award_info
            });
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message,
                type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/award');
            })
        })
}

exports.award_display_list = (req, res) => {
    award_model.award_display_list(req.session.company, req.query)
        .then((result) => {
            res.render('award', {
                title: "暢銷排行榜",
                icon: '<span class="glyphicon glyphicon-certificate" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">暢銷排行榜</li>',
                message: req.flash(`flash`),
                data: result.rows,
                pagination: result.pagination,
                pagination_path: 'award'
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

exports.award_new = (req, res) => {
    award_model.product_list(req.session.company)
        .then((result) => {
            var award_info = req.session.award_info;
            req.session.award_info = null;
            res.render('award_add', {
                title: "暢銷排行榜",
                icon: '<span class="glyphicon glyphicon-certificate" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/award">暢銷排行榜</a></li><li class="active">新增暢銷排行榜</li>',
                message: req.flash(`flash`),
                validation: req.flash(`validation`),
                data: result,
                award_info: award_info
            });
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message,
                type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/award');
            })
        })
}


exports.award_update = (req, res) => {

    var product_id;
    Array.isArray(req.body.product_id) ? product_id = req.body.product_id : product_id = [req.body.product_id];

    award_info = {
        award_name: req.body.award_name,
        award_description: req.body.award_description
    }

    award_model.award_update(req.params.id, award_info, product_id)
        .then((result) => {
            req.flash(`flash`, {
                msg: result,
                type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/award');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message,
                type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/award');
            })
        })
}

exports.award_delete = (req, res) => {
    award_model.award_delete(req.params.id)
        .then((result) => {
            req.flash(`flash`, {
                msg: result,
                type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/award');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message,
                type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/award');
            })
        })
}


