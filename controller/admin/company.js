const company_model = require('../../model/admin/company')

exports.company_create = (req, res) => {
    var insertValues = 'Entering';
    company_model.addCompany(insertValues).then((result) => {
        req.flash('success', "資料更新成功");
        res.redirect('/api/company/new');
    }).catch((err) => {
        req.flash('error', "數據庫並未連接");
        req.session.save(function (err) {
            res.redirect('/api/company/new');
        })
    })
}

exports.company_display = (req, res) => {

}

exports.company_display_list = (req, res) => {
    res.render('company', {
        user: req.session.username,
        title: "公司",
        icon: '<span class="glyphicon glyphicon-home" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">公司</li>'
    });
}

exports.company_new = (req, res) => {
    res.render('company_modify', {
        user: req.session.username,
        title: "公司",
        icon: '<span class="glyphicon glyphicon-home" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li><a href="/api/company">公司</a></li><li class="active">新增公司</li>',
        message: req.flash('error')
    });
}

exports.company_update = (req, res) => {

}

exports.company_delete = (req, res) => {
    /*title = JSON.stringify(req.body.title);
    message = JSON.stringify(req.body.title);*/
    console.log(req.body.title);
    console.log(req.body.message);
    res.send("This if far away from Express : " + req.body.title);
}