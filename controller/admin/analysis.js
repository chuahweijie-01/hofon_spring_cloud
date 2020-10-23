const analysisModel = require('../../model/admin/analysis');

exports.getAnalysisReportList = (req, res) => {
    analysisModel.getAnalysisReportList(req.query, req.session.company)
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
    var analysisId = req.params.id;
    analysisModel.getAnalysisReport(analysisId)
        .then((result) => {
            //res.send('Hello World ! ')
            res.render('analysis_report', {
                title: "分析報告",
                icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a><li class="active">分析報告</li>',
                message: req.flash(`flash`),
                data: result,
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