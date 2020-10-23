const analysisModel = require('../../model/third_party_application/analysis');
const uploadImage = require('../../middleware/third_party_application/upload_image');
const fs = require('fs');
const mv = require('mv');

exports.upload = (req, res, next) => {
    /*uploadImage.analysisImage(req, res, (err) => {
        if (err) res.status(404).send(err);
        else {
            console.log(req.files);
            next();
        }
    })*/

    var tempFolderName = Date.now();
    req.session.tempFolderName = tempFolderName;
    uploadImage.analysisImageFunction(tempFolderName)(req, res, (err) => {
        if (err) {
            res.status(404).send(err);
        } else {
            next();
        }
    })
}

exports.insertAnalysisData = (req, res) => {
    // POSTMAN Body-raw-JSON
    //var analysisInfo = req.body.analysisInfo;
    //var analysisDetails = req.body.analysisDetails;

    //POSTMAN Body-form-data
    var analysisInfo = JSON.parse(req.body.analysisInfo);
    var analysisDetails = JSON.parse(req.body.analysisDetails);

    var userId = analysisInfo.user_id;
    var companyId = analysisInfo.company_id;

    var tempFolder = req.files[0].destination;
    var targetFolderName = req.session.tempFolderName;
    var targetDestination = `public/image/user/${companyId}/${userId}/${targetFolderName}`;
    
    req.session.tempFolderName = null;

    analysisInfo['image_path'] = `/image/user/${companyId}/${userId}/${targetFolderName}`;

    analysisModel.insertAnalysisData(analysisInfo, analysisDetails)
        .then((result) => {
            mv(tempFolder, targetDestination, {mkdirp: true}, (err) => {
                console.log(err)
            })
            res.status(200).send({ message: result });
        })
        .catch((err) => {
            fs.rmdirSync(tempFolder, { recursive: true })
            res.status(404).send({ message: err.message });
        })
}

exports.deleteAnalysisData = (req, res) => {
    var analysisId = req.params.id;
    analysisModel.deleteAnalysisData(analysisId)
        .then((result) => {
            fs.rmdirSync(`public/${result[0].image_path}`, { recursive: true });
            res.status(200).send({ message: '已刪除伺服器裏的分析數據' });
        })
        .catch((err) => {
            res.status(404).send({ message: err.message });
        })
}