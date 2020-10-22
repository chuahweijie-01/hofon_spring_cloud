const user_model = require('../../model/admin/user')

exports.getUserList = (req, res) => {
    user_model.getUserList(req.query, req.session.company, req.session.role).then((result) => {
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

exports.deactivateUser = (req, res) => {
    user_model.deactivateUser(req.params.id)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(404).send(err);
        })
}

exports.reactivateUser = (req, res) => {
    user_model.reactivateUser(req.params.id)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(404).send(err);
        })
}