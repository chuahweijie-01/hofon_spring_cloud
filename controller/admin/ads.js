const ads_model = require('../../model/admin/ads')

exports.ads_create = (req, res) => {
    var insertValues = 'Entering';
    ads_model.addAds(insertValues).then((result) => {
        req.flash('success', "資料更新成功");
        res.redirect('/api/ads/new');
    }).catch((err) => {
        req.flash('error', "數據庫並未連接");
        req.session.save(function (err) {
            res.redirect('/api/ads/new');
        })
    })
}

exports.ads_display = (req, res) => {
    
}

exports.ads_display_list = (req, res) => {
    res.render('ads',{
        user: req.session.username,
        title: "廣告",
        icon: '<span class="glyphicon glyphicon-comment" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">廣告</li>'
    });
}

exports.ads_new = (req, res) => {
    res.render('ads_modify',{
        user: req.session.username,
        title: "廣告",
        icon: '<span class="glyphicon glyphicon-comment" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/ads">廣告</a></li><li class="active">新增廣告</li>',
        message: req.flash('error')
    });
}


exports.ads_update = (req, res) => {
    
}

exports.ads_delete = (req, res) => {
    
}


