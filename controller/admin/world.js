const world_model = require('../../model/admin/world');

exports.world_create = (req, res) => {
    world_info = {
        country_code: req.body.country_code,
        country_name_chinese: req.body.country_name_chinese,
        country_name_english: req.body.country_name_english
    }

    console.log(world_info)

    world_model.world_create(world_info)
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/world');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/world');
            })
        })
}

exports.world_display_list = (req, res) => {
    world_model.world_display_list(req.query)
        .then((result) => {
            res.render('world', {
                title: "區域",
                icon: '<span class="glyphicon glyphicon-globe" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">區域</li>',
                message: req.flash(`flash`),
                data: result.rows,
                pagination: result.pagination,
                pagination_path: 'world'
            });
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/dashboard');
            })
        })
}

exports.world_new = (req, res) => {
    var world_info = req.session.world_info;
    req.session.world_info = null;
    res.render('world_add', {
        title: "區域",
        icon: '<span class="glyphicon glyphicon-globe" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/world">區域</a></li><li class="active">新增區域</li>',
        message: req.flash(`flash`),
        validation: req.flash(`validation`),
        world_info: world_info
    });
}

exports.world_display = (req, res) => {
    world_model.world_display(req.params.id)
        .then((result) => {
            var world_info = req.session.world_info;
            req.session.world_info = null;
            res.render('world_edit', {
                title: "區域",
                icon: '<span class="glyphicon glyphicon-globe" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/world">區域</a></li><li class="active">更新區域</li>',
                message: req.flash(`flash`),
                validation: req.flash(`validation`),
                world_info: world_info,
                data: result
            });
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/dashboard');
            })
        })
}

exports.world_delete = (req, res) => {
    world_model.world_delete(req.params.id)
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/world');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/world');
            })
        })
}