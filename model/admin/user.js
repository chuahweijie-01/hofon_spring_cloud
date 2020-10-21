const connectionPool = require('../../conf/db');

exports.user_display_list = (page_info, company_id, role) => {
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
                    if (role == 1) {
                        query = `SELECT user.user_id, user.user_email, user.user_name, company.company_name, user.user_gender, user_status,
                                 DATE_FORMAT(user.created_date, '%d-%c-%Y %H:%i:%s') AS created_date
                                 FROM userdb.user AS user
                                 JOIN userdb.user_company AS user_company ON user.user_id = user_company.user_id
                                 JOIN companydb.company AS company ON user_company.company_id = company.company_id
                                 GROUP BY user.user_email LIMIT ${limit}`;
                    } else {
                        query = `SELECT user.user_id, user.user_email, user.user_name, user.user_gender, user_status,
                                 DATE_FORMAT(user.last_login, '%d-%c-%Y %H:%i:%s') AS last_login
                                 FROM userdb.user AS user
                                 JOIN userdb.user_company AS user_company ON user.user_id = user_company.user_id 
                                 WHERE user_company.company_id = ${company_id} LIMIT ${limit}`;
                    }
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

exports.user_deactivate = (user_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`UPDATE userdb.user SET user_status = 0 WHERE user_id = ?`, [user_id])
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (`已凍結用戶`);
            else return (`用戶凍結失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err);
        })
        .finally(() => {
            connection.release();
        })
}

exports.user_reactivate = (user_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`UPDATE userdb.user SET user_status = 1 WHERE user_id = ?`, [user_id])
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (`已凍結用戶`);
            else return (`用戶凍結失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err);
        })
        .finally(() => {
            connection.release();
        })
}