const connectionPool = require('../../conf/db');

exports.getUserList = (pageInfo, companyId, role) => {
    var connection;
    var pageSize = 10;
    var numberOfRows, numberOfPages;
    var numberPerPage = parseInt(pageSize, 10) || 1;
    var page = parseInt(pageInfo.page, 10) || 1;
    var skip = (page - 1) * numberPerPage;
    var limit = `${skip} , ${numberPerPage}`;
    var query;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT COUNT(*) AS total_user FROM userdb.user`)
        })
        .then(([rows, field]) => {
            numberOfRows = rows[0].total_admin;
            numberOfPages = Math.ceil(numberOfRows / numberPerPage);
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
                         WHERE user_company.company_id = ${companyId} LIMIT ${limit}`;
            }
            return connection.query(query)
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

exports.deactivateUser = (userId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`UPDATE userdb.user SET user_status = 0 WHERE user_id = ?`, [userId])
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (`已凍結用戶`);
            else return (`用戶凍結失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err);
        })
        .finally(() => {
            connection.release();
        })
}

exports.reactivateUser = (userId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`UPDATE userdb.user SET user_status = 1 WHERE user_id = ?`, [userId])
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (`已凍結用戶`);
            else return (`用戶凍結失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err);
        })
        .finally(() => {
            connection.release();
        })
}