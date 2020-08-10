const discount_model = require('../../model/admin/discount')

exports.discount_create = (req, res) => {
    var insertValues = 'Entering';
    discount_model.addDiscount(insertValues).then((result) => {
        req.flash('flash', {
            'msg' : '注冊成功',
            'type': 'success'
        });
        res.redirect('/api/discount/new');
    }).catch((err) => {
        req.flash('flash', {
            'msg' : '數據庫並未連接',
            'type': 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/discount/new');
        })
    })
}

exports.discount_display = (req, res) => {
    
}

exports.discount_display_list = (req, res) => {
    res.render('discount',{
        title: "促銷",
        icon: '<span class="glyphicon glyphicon-gift" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">促銷</li>'
    });
}

exports.discount_new = (req, res) => {
    res.render('discount_modify',{
        title: "促銷",
        icon: '<span class="glyphicon glyphicon-gift" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/discount">促銷</a></li><li class="active">新增促銷</li>',
        message: req.flash('flash')
    });
}


exports.discount_update = (req, res) => {
    
}

exports.discount_delete = (req, res) => {
    
}


