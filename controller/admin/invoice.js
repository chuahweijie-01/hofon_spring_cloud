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

exports.invoice_display = (req, res) => {
    invoice_model.invoice_display(req.params.id, req.session.company)
        .then((result) => {
            res.render('invoice_view', {
                title: "訂單維護",
                icon: '<span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a></li><li><a href="/api/invoice">訂單維護</a></li><li class="active">訂單詳情</li>',
                message: req.flash(`flash`),
                data: result
            });
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/invoice');
            })
        })
}

exports.invoice_update = (req, res) => {
    invoice_info = {
        order_status: req.params.status,
        order_remarks: req.body.order_remarks
    }

    invoice_model.invoice_update(req.params.id, invoice_info)
        .then((result) => {
            req.flash(`flash`, {
                msg: result, type: 'success'
            });
            req.session.save(function (err) {
                res.redirect(`/api/invoice`);
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect(`/api/invoice/${req.params.id}`);
            })
        })

}