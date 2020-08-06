const award_model = require('../../model/admin/award')

exports.award_create = (req, res) => {
    var insertValues = 'Entering';
    award_model.addAward(insertValues).then((result) => {
        req.flash('success', "資料更新成功");
        res.redirect('/api/award/new');
    }).catch((err) => {
        req.flash('error', "數據庫並未連接");
        req.session.save(function (err) {
            res.redirect('/api/award/new');
        })
    })
}

exports.award_display = (req, res) => {
    
}

exports.award_display_list = (req, res) => {
    res.render('award',{
        user: req.session.username,
        title: "榮譽",
        icon: '<span class="glyphicon glyphicon-certificate" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">榮譽</li>'
    });
}

exports.award_new = (req, res) => {
    res.render('award_modify',{
        user: req.session.username,
        title: "榮譽",
        icon: '<span class="glyphicon glyphicon-certificate" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/award">榮譽</a></li><li class="active">新增榮譽</li>',
        message: req.flash('error')
    });
}


exports.award_update = (req, res) => {
    
}

exports.award_delete = (req, res) => {
    
}


