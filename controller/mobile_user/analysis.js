const analysisModel = require('../../model/mobile_user/analysis');

exports.getAnalysisReport = (req, res) => {
    var analysisId = req.params.id;
    var companyId = req.query.company;
    /*analysisModel.getAnalysisReport(analysisId, companyId)
        .then((result) => {
            var analysisItem = [];
            var itemScore = [];
            for (var item in result) {
                analysisItem.push(result[item].model_name_chn);
                itemScore.push(result[item].score);
            }
            res.render('mobile_analysis_report_view', {
                title: '分析報告',
                data: result,
                analysisItem: analysisItem,
                itemScore: itemScore
            });
        }).catch((err) => {
            req.flash(`flash`, {
                msg: err.message, type: `error`
            });
            req.session.save(function (err) {
                res.redirect('/api/dashboard');
            })
        })*/
    res.status(200).send('MAINTENANCE ...');
}

exports.getAnalysisReportList = (req, res) => {
    var userId = req.session.user;
    var companyId = req.session.company;
    analysisModel.getAnalysisReportList(userId, companyId)
        .then((result) => {
            res.status(200).send({ analysisInfo: result, companyId: companyId });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}

exports.getAnalysisCompareReport = (req, res) => {
    var analysisId1 = req.query.analysis1;
    var analysisItem1 = [];
    var itemScore1 = [];
    var analysisId2 = req.query.analysis2;
    var analysisItem2 = [];
    var itemScore2 = [];
    var companyId = req.query.company;
    var analysisId1Report, analysisId2Report;

    /*analysisModel.getAnalysisReport(analysisId1, companyId)
        .then((result) => {
            analysisId1Report = result;
            for (var item in result) {
                analysisItem1.push(result[item].model_name_chn);
                itemScore1.push(result[item].score);
            }
            return analysisModel.getAnalysisReport(analysisId2, companyId);
        })
        .then((result) => {
            analysisId2Report = result;
            for (var item in result) {
                analysisItem2.push(result[item].model_name_chn);
                itemScore2.push(result[item].score);
            }
            res.render('mobile_analysis_compare_report_view', {
                title: '分析報告',
                analysisId1Report: analysisId1Report,
                analysisId2Report: analysisId2Report,
                analysisItem1: analysisItem1,
                analysisItem2: analysisItem2,
                itemScore1: itemScore1,
                itemScore2: itemScore2
            });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message })
        })*/
    res.status(200).send('MAINTENANCE ...');
}