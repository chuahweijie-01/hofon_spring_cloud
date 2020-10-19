const analysis_model = require('../../model/mobile_user/analysis');

exports.insertAnalysisData = (req, res) => {
    console.log(req.body.analysisInfo)
    var analysisInfo = req.body.analysisInfo;
    var analysisDetails = req.body.analysisDetails;
    analysis_model.insertAnalysisData(analysisInfo, analysisDetails)
        .then((result) => {
            res.status(200).send({ message: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}