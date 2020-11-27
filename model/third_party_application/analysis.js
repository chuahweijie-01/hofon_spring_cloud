const connectionPool = require('../../conf/db');

exports.insertAnalysisData = (analysisInfo, analysisDetails) => {
    var connection, analysisId;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`START TRANSACTION`);
            //General info { user_id: user_id, company_id: company_id, analysis_date: analysis_date }
            //return connection.query(`INSERT INTO analysisdb.analysis SET ?`, [analysisInfo])
        })
        .then((result) => {
            return connection.query(`
            INSERT INTO
                analysisdb.analysis
            SET ?`, [analysisInfo])
        })
        .then((result) => {
            if (result[0].affectedRows === 1) {
                analysisId = result[0].insertId;
                for (var array in analysisDetails)
                    analysisDetails[array].unshift(analysisId);
                return connection.query(`
                INSERT INTO
                    analysisdb.analysis_details
                    (analysis_id, model_id, score, image_name)
                VALUES ?`, [analysisDetails])
            } else {
                throw new Error('資料新增失敗');
            }
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return connection.query(`COMMIT`);
            else throw new Error('項目新增失敗');
        })
        .then((result) => {
            return ('資料成功上傳至伺服器');
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err);
        })
        .finally(() => {
            connection.release();
        })
}

exports.deleteAnalysisData = (analysisId) => {
    var connection, imagePath;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                image_path
            FROM
                analysisdb.analysis
            WHERE
                analysis_id = ?`, [analysisId])
        })
        .then(([rows, field]) => {
            imagePath = rows;
            return connection.query(`
            DELETE FROM
                analysisdb.analysis
            WHERE
                analysis_id = ?`, [analysisId]);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return (imagePath)
            else throw new Error('無法刪除伺服器分析數據')
        })
        .catch((err) => {
            console.error(err);
            throw new Error(analysis_id);
        })
        .finally(() => {
            connection.release();
        })
}