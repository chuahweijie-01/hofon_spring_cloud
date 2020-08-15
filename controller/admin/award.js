const award_model = require('../../model/admin/award')

exports.award_create = (req, res) => {
    award_info = {
        company_id: req.session.company,
        award_name: req.body.award_name,
        award_description: req.body.award_description
    }

    award_model.award_create(award_info, req.body.product_id).then((result) => {
        req.flash('flash', {
            'msg': '注冊成功',
            'type': 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/award');
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': '數據庫並未連接',
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/award');
        })
    })
}

exports.award_display = (req, res) => {
    award_model.product_list(req.session.company).then((product) => {
        award_model.award_display(req.params.id).then((award) => {
            res.render('award_edit', {
                title: "榮譽",
                icon: '<span class="glyphicon glyphicon-certificate" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/award">榮譽</a></li><li class="active">新增榮譽</li>',
                message: req.flash('flash'),
                data: award,
                product: product
            });
        }).catch((err) => {
            req.flash('flash', {
                'msg': err.message,
                'type': 'error'
            });
            req.session.save(function (err) {
                res.redirect('/api/award');
            })
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/award');
        })
    })
}

exports.award_display_list = (req, res) => {
    award_model.award_display_list(req.session.company).then((result) => {
        res.render('award', {
            title: "榮譽",
            icon: '<span class="glyphicon glyphicon-certificate" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">榮譽</li>',
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

exports.award_new = (req, res) => {
    award_model.product_list(req.session.company).then((result) => {
        res.render('award_add', {
            title: "榮譽",
            icon: '<span class="glyphicon glyphicon-certificate" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/award">榮譽</a></li><li class="active">新增榮譽</li>',
            message: req.flash('flash'),
            data: result
        });
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/award');
        })
    })
}


exports.award_update = (req, res) => {

    award_info = {
        award_name: req.body.award_name,
        award_description: req.body.award_description
    }

    award_model.award_update(req.params.id, award_info, req.body.product_id).then((result) => {
        req.flash('flash', {
            'msg': result,
            'type': 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/award');
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/award');
        })
    })
}

exports.award_delete = (req, res) => {
    award_model.award_delete(req.params.id).then((result) => {
        req.flash('flash', {
            'msg': result,
            'type': 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/award');
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/award');
        })
    })
}


