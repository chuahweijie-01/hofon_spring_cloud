const analysis_model = require('../../model/mobile_user/analysis');

exports.insertAnalysisData = () => {
    analysis_model.insertAnalysisData()
        .then((result) => {
            res.status(200).send({ message: result });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}