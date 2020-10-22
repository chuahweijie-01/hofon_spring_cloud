const connectionPool = require('../../conf/db');

exports.insertAnalysisData = (analysisInfo, analysisDetails) => {
    var connection, analysisId;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            //General info { user_id: user_id, company_id: company_id, analysis_date: analysis_date }
            return connection.query(`INSERT INTO analysisdb.analysis SET ?`, [analysisInfo])
        })
        .then((result) => {
            if (result[0].affectedRows === 1) {
                analysisId = result[0].insertId;
                for (var array in analysisDetails)
                    analysisDetails[array].unshift(analysisId);
                return connection.query(`INSERT INTO analysisdb.analysis_details (analysis_id, model_id, score, image_path) VALUES ?`, [analysisDetails])
            } else {
                throw new Error(`資料新增失敗`)
            }

        })
        .then((result) => {
            if (result[0].affectedRows >= 1)
                return result;
            else throw new Error(`項目新增失敗`)
        })
        .catch((err) => {
            console.error(err);
            throw new Error(analysis_id);
        })
        .finally(() => {
            connection.release();
        })
}