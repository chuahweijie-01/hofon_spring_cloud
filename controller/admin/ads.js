const ads_model = require('../../model/admin/ads')

exports.ads_create = (req, res) => {

    advertisement_info = {
        company_id: req.session.company,
        advertisement_name: req.body.advertisement_name,
        advertisement_image: req.body.advertisement_image,
        advertisement_link: req.body.advertisement_link
    }

    ads_model.ads_create(advertisement_info).then((result) => {
        req.flash('flash', {
            'msg': result,
            'type': 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/ads');
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/ads');
        })
    })
}

exports.ads_display = (req, res) => {
    ads_model.ads_display(req.params.id).then((result) => {
        res.render('ads_edit', {
            title: "廣告",
            icon: '<span class="glyphicon glyphicon-comment" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/ads">廣告</a></li><li class="active">更新廣告</li>',
            message: req.flash('flash'),
            data: result
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/admin');
        })
    })
}

exports.ads_display_list = (req, res) => {
    ads_model.ads_display_list(req.session.company).then((result) => {
        console.log(result)
        res.render('ads', {
            title: "廣告",
            icon: '<span class="glyphicon glyphicon-comment" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">廣告</li>',
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

exports.ads_new = (req, res) => {
    res.render('ads_add', {
        title: "廣告",
        icon: '<span class="glyphicon glyphicon-comment" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/ads">廣告</a></li><li class="active">新增廣告</li>',
        message: req.flash('flash')
    });
}


exports.ads_update = (req, res) => {
    advertisement_info = {
        advertisement_name: req.body.advertisement_name,
        advertisement_image: req.body.advertisement_image,
        advertisement_link: req.body.advertisement_link
    }

    ads_model.ads_update(req.params.id, advertisement_info).then((result) => {
        req.flash('flash', {
            'msg': result,
            'type': 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/ads');
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/ads');
        })
    })
}

exports.ads_delete = (req, res) => {
    ads_model.ads_delete(req.params.id).then((result) => {
        req.flash('flash', {
            'msg': result,
            'type': 'success'
        });
        req.session.save(function (err) {
            res.redirect('/api/ads');
        })
    }).catch((err) => {
        req.flash('flash', {
            'msg': err.message,
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/ads');
        })
    })
}


