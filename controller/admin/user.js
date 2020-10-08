const user_model = require('../../model/admin/user')

exports.user_display_list = (req, res) => {
    user_model.user_display_list(req.query, req.session.company, req.session.role).then((result) => {
        res.render('user', {
            title: "消費者",
            icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
            navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">消費者</li>',
            message: req.flash(`flash`),
            data: result.rows,
            pagination: result.pagination,
            pagination_path: 'user'
        });
    }).catch((err) => {
        req.flash(`flash`, {
            msg: err.message, type: `error`
        });
        req.session.save(function (err) {
            res.redirect('/api/dashboard');
        })
    })
}

exports.user_deactivate = (req, res) => {
    user_model.user_deactivate(req.params.id)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(404).send(err);
        })
}

exports.user_reactivate = (req, res) => {
    user_model.user_reactivate(req.params.id)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(404).send(err);
        })
}