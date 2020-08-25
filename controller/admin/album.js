const album_model = require('../../model/admin/album')

exports.album_display_list = (req, res) => {
    album_model.album_display_list(req.session.company).then((result) => {
        res.render('album', {
            title: "測試用界面",
            icon: '<span class="glyphicon glyphicon-film" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">管理總表</a></li><li>測試用界面</li>',
            message: req.flash('flash'),
            data: result
        });
    }).catch((err) => {
        req.flash('flash', {
            msg: err.message,
            type: 'error'
        });
        req.session.save(function (err) {
            res.redirect('/api/dashboard');
        })
    })
}