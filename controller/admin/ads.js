const ads_model = require('../../model/admin/ads')

exports.ads_create = (req, res) => {
    var insertValues = 'Entering';
    ads_model.addAds(insertValues).then((result) => {
        req.flash('flash', {
            'msg' : '注冊成功',
            'type': 'success'
        });
        res.redirect('/api/ads/new');
    }).catch((err) => {
        req.flash('flash', {
            'msg' : '數據庫並未連接',
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/ads/new');
        })
    })
}

exports.ads_display = (req, res) => {
    
}

exports.ads_display_list = (req, res) => {
    res.render('ads',{
        title: "廣告",
        icon: '<span class="glyphicon glyphicon-comment" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">廣告</li>'
    });
}

exports.ads_new = (req, res) => {
    res.render('ads_modify',{
        title: "廣告",
        icon: '<span class="glyphicon glyphicon-comment" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/ads">廣告</a></li><li class="active">新增廣告</li>',
        message: req.flash('flash')
    });
}


exports.ads_update = (req, res) => {
    
}

exports.ads_delete = (req, res) => {
    
}


