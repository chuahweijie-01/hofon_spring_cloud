const connectionPool = require('../../conf/db');

exports.getAnalysisReport = (analysisId, companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT *
            FROM
                analysisdb.analysis_full_information
            WHERE
                analysis_id = ?
                AND company_id = ?`, [analysisId, companyId]);
        })
        .then(([rows, field]) => {
            if (rows.length) return rows;
            else throw new Error('系統暫時無法運行該功能');
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err);
        })
        .finally(() => {
            connection.release();
        })
}

exports.getAnalysisReportList = (userId, companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                analysis_id,
                analysis_date,
                created_date
            FROM
                analysisdb.analysis
            WHERE
                company_id = ?
                AND user_id = ?`, [companyId, userId]);
        })
        .then(([rows, field]) => {
            return rows;
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err);
        })
        .finally(() => {
            connection.release();
        })
}