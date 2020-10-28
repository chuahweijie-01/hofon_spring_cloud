const connectionPool = require('../../conf/db');

exports.getAnalysisReportList = (pageInfo, company_id) => {
    var connection;
    var pageSize = 10;
    var numberOfRows, numberOfPages;
    var numberPerPage = parseInt(pageSize, 10) || 1;
    var page = parseInt(pageInfo.page, 10) || 1;
    var skip = (page - 1) * numberPerPage;
    var limit = `${skip} , ${numberPerPage}`;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT COUNT(*) AS analysisTotal FROM analysisdb.analysis`)
        })
        .then(([rows, field]) => {
            numberOfRows = rows[0].analysisTotal;
            numberOfPages = Math.ceil(numberOfRows / numberPerPage);
            return connection.query(`SELECT analysis.analysis_id, analysis.analysis_date, user.user_name, user.user_gender, COUNT(*) AS total_method,
                                     DATE_FORMAT(analysis.created_date, '%d-%c-%Y %H:%i:%s') AS created_date FROM analysisdb.analysis AS analysis
                                     JOIN analysisdb.analysis_details AS analysis_details ON analysis.analysis_id = analysis_details.analysis_id
                                     JOIN userdb.user AS user ON analysis.user_id = user.user_id
                                     WHERE analysis.company_id = ? AND analysis_details.image_name <> 'null' GROUP BY analysis.analysis_id LIMIT ${limit}`, [company_id]);
        })
        .then(([rows, field]) => {
            result = {
                rows: rows,
                pagination: {
                    current: page,
                    numberPerPage: numberPerPage,
                    has_previous: page > 1,
                    previous: page - 1,
                    has_next: page < numberOfPages,
                    next: page + 1,
                    last_page: Math.ceil(numberOfRows / pageSize)
                }
            }
            return (result);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
};

exports.getAnalysisReport = (analysisId, companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT * FROM analysisdb.analysis_full_information WHERE analysis_id = ? AND company_id = ?`, [analysisId, companyId])
        })
        .then(([rows, field]) => {
            if (rows.length) return rows;
            else throw new Error('系統暫時無法運行該功能')
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
            return connection.query(`SELECT image_path FROM analysisdb.analysis WHERE analysis_id = ?`, [analysisId])
        })
        .then(([rows, field]) => {
            imagePath = rows;
            return connection.query(`DELETE FROM analysisdb.analysis WHERE analysis_id = ?`, [analysisId]);
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