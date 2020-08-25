const user_model = require('../../model/admin/user')

exports.user_create = (req, res) => {

}

exports.user_create_address = (req, res) => {

}

exports.user_display = (req, res) => {

}

exports.user_display_list = (req, res) => {

    user_model.user_display_list(req.query, req.session.company, req.session.role).then((result) => {
        res.render('user', {
            title: "消費者",
            icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">消費者</li>',
            message: req.flash('flash'),
            data: result.rows,
            pagination: result.pagination,
            pagination_path: 'user'
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

exports.user_display_address = (req, res) => {

}

exports.user_update = (req, res) => {

}

exports.user_delete = (req, res) => {

}

exports.user_delete_address = (req, res) => {

}

