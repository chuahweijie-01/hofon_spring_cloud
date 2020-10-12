const invoice_model = require('../../model/admin/invoice');

exports.invoice_display_list = (req, res) => {
    invoice_model.invoice_display_list(req.session.company, req.query)
        .then((result) => {
            res.render('invoice', {
                title: "訂單維護",
                icon: '<span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li class="active">訂單維護</li>',
                message: req.flash(`flash`),
                data: result.rows,
                pagination: result.pagination,
                pagination_path: 'invoice'
            });
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message,
                type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/dashboard');
            })
        })
}