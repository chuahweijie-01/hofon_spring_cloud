const analysisModel = require('../../model/admin/analysis');
const fs = require('fs');

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
    var companyId = req.session.company;
    analysisModel.getAnalysisReport(analysisId, companyId)
        .then((result) => {
            var analysisItem = [];
            var itemScore = [];
            for (var item in result) {
                analysisItem.push(result[item].model_name_chn);
            }
            for (var score in result) {
                itemScore.push(result[score].score);
            }
            res.render('analysis_report', {
                title: '分析報告',
                icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
                navigation: '<li><a href="/api/dashboard">管理總表</a><li class="active">分析報告</li>',
                message: req.flash(`flash`),
                data: result,
                analysisItem : analysisItem,
                itemScore: itemScore
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

exports.deleteAnalysisData = (req, res) => {
    var analysisId = req.params.id;
    analysisModel.deleteAnalysisData(analysisId)
        .then((result) => {
            fs.rmdirSync(`public/${result[0].image_path}`, { recursive: true });
            req.flash(`flash`, {
                msg: '已刪除分析報告',
                type: 'success'
            });
            req.session.save(function (err) {
                res.redirect('/api/analysis');
            })
        })
        .catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/analysis');
            })
        })
}