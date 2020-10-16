const connectionPool = require('../../conf/db');

exports.analysis_report_list = (page_info, company_id) => {
    var page_size = 10;
    var number_of_rows, number_of_pages;
    var number_per_page = parseInt(page_size, 10) || 1;
    var page = parseInt(page_info.page, 10) || 1;
    var skip = (page - 1) * number_per_page;
    var limit = `${skip} , ${number_per_page}`;
    var query;

    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT COUNT(*) AS total_user FROM userdb.user`)
                .then(([rows, field]) => {
                    number_of_rows = rows[0].total_admin;
                    number_of_pages = Math.ceil(number_of_rows / number_per_page);
                    query = `SELECT user.user_id, user.user_email, user.user_name, user.user_gender, user_status,
                             DATE_FORMAT(user.last_login, '%D %M %Y %H:%i:%s') AS last_login FROM userdb.user AS user
                             JOIN userdb.user_company AS user_company ON user.user_id = user_company.user_id 
                             WHERE user_company.company_id = ${company_id} LIMIT ${limit}`;

                    return connection.query(query)
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