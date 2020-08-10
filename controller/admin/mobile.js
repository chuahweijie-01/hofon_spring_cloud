const mobile_model = require('../../model/admin/mobile')

exports.mobile_create = (req, res) => {
    var insertValues = 'Entering';
    mobile_model.addMobileSetting(insertValues).then((result) => {
        req.flash('flash', {
            'msg' : '注冊成功',
            'type': 'success'
        });
        res.redirect('/api/mobile');
    }).catch((err) => {
        req.flash('flash', {
            'msg' : '數據庫並未連接',
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/mobile');
        })
    })
}

exports.mobile_display = (req, res) => {
    
}

exports.mobile_display_list = (req, res) => {
    res.render('mobile_modify',{
        title: "軟體設定",
        icon: '<span class="glyphicon glyphicon-phone" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">軟體設定</li>',
        message: req.flash('flash')
    });
}

exports.mobile_update = (req, res) => {
    
}



