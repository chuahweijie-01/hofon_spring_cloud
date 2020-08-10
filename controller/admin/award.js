const award_model = require('../../model/admin/award')

exports.award_create = (req, res) => {
    var insertValues = 'Entering';
    award_model.addAward(insertValues).then((result) => {
        req.flash('flash', {
            'msg' : '注冊成功',
            'type': 'success'
        });
        res.redirect('/api/award/new');
    }).catch((err) => {
        req.flash('flash', {
            'msg' : '數據庫並未連接',
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/award/new');
        })
    })
}

exports.award_display = (req, res) => {
    
}

exports.award_display_list = (req, res) => {
    res.render('award',{
        title: "榮譽",
        icon: '<span class="glyphicon glyphicon-certificate" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">榮譽</li>'
    });
}

exports.award_new = (req, res) => {
    res.render('award_modify',{
        title: "榮譽",
        icon: '<span class="glyphicon glyphicon-certificate" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/award">榮譽</a></li><li class="active">新增榮譽</li>',
        message: req.flash('flash')
    });
}


exports.award_update = (req, res) => {
    
}

exports.award_delete = (req, res) => {
    
}


