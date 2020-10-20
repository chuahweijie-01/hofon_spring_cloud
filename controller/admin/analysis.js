const analysis_model = require('../../model/admin/analysis');

exports.analysis_report_list = (req, res) => {
    analysis_model.analysis_report_list(req.query, req.session.company)
        .then((result) => {
            res.render('analysis', {
                title: "分析報告",
                icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a><li class="active">分析報告</li>',
                message: req.flash(`flash`),
                data: result.rows,
                pagination: result.pagination,
                pagination_path: 'analysis'
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

exports.analysis_report = (req, res) => {
    res.send('Hello World ! ')
}