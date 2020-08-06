const mobile_model = require('../../model/admin/mobile')

exports.mobile_create = (req, res) => {
    
}

exports.mobile_display = (req, res) => {
    
}

exports.mobile_display_list = (req, res) => {
    res.render('mobile_modify',{
        user: req.session.username,
        title: "軟體設定",
        icon: '<span class="glyphicon glyphicon-phone" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">軟體設定</li>',
        message: req.flash('error')
    });
}

exports.mobile_update = (req, res) => {
    
}



