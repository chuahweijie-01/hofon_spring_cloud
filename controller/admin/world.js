const world_model = require('../../model/admin/world');

exports.addNewCountry = (req, res) => {
    world_info = {
        country_code: req.body.country_code,
        country_name_chinese: req.body.country_name_chinese,
        country_name_english: req.body.country_name_english
    }

    world_model.addNewCountry(world_info)
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

exports.addNewCity = (req, res) => {
    world_info = {
        country_id: req.params.id,
        city_name: req.body.city_name
    }
    world_model.addNewCity(world_info)
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect(`/api/world/${req.params.id}`);
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect(`/api/world/${req.params.id}`);
            })
        })
}

exports.getCountryList = (req, res) => {
    world_model.getCountryList(req.query)
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

exports.updateCountry = (req, res) => {
    var countryInfo = {
        country_code: req.body.country_code,
        country_name_chinese: req.body.country_name_chinese,
        country_name_english: req.body.country_name_english
    }
    world_model.updateCountry(countryInfo, req.params.id)
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

exports.getCountry = (req, res) => {
    world_model.getCountry(req.params.id)
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

exports.deleteCountry = (req, res) => {
    world_model.deleteCountry(req.params.id)
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

exports.deleteCity = (req, res) => {
    world_model.deleteCity(req.params.city_id)
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect(`/api/world/${req.params.id}`);
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect(`/api/world/${req.params.id}`);
            })
        })
}