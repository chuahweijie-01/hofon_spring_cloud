const connectionPool = require('../../conf/db');

exports.analysis_report_list = (page_info, company_id) => {
    var page_size = 10;
    var number_of_rows, number_of_pages;
    var number_per_page = parseInt(page_size, 10) || 1;
    var page = parseInt(page_info.page, 10) || 1;
    var skip = (page - 1) * number_per_page;
    var limit = `${skip} , ${number_per_page}`;

    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT COUNT(*) AS analysisTotal FROM analysisdb.analysis`)
                .then(([rows, field]) => {
                    number_of_rows = rows[0].analysisTotal;
                    number_of_pages = Math.ceil(number_of_rows / number_per_page);
                    return connection.query(`SELECT analysis.analysis_id, user.user_name, user.user_gender, COUNT(*) AS total_method,
                                             DATE_FORMAT(analysis.created_date, '%d-%c-%Y %H:%i:%s') AS created_date FROM analysisdb.analysis AS analysis
                                             JOIN analysisdb.analysis_details AS analysis_details ON analysis.analysis_id = analysis_details.analysis_id
                                             JOIN userdb.user AS user ON analysis.user_id = user.user_id
                                             WHERE analysis.company_id = ? GROUP BY analysis.analysis_id LIMIT ${limit}`, [company_id]);
                })
                .then(([rows, field]) => {
                    result = {
                        rows: rows,
                        pagination: {
                            current: page,
                            number_per_page: number_per_page,
                            has_previous: page > 1,
                            previous: page - 1,
                            has_next: page < number_of_pages,
                            next: page + 1,
                            last_page: Math.ceil(number_of_rows / page_size)
                        }
                    }
                    return (result);
                })
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`系統暫時無法運行該功能`);
        })
};