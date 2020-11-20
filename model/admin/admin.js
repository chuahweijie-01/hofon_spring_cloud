const connectionPool = require('../../conf/db');

exports.getAdmin = (adminId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT *
            FROM
                companydb.admin
            WHERE
                admin_id = ?`, [adminId]);
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('系統暫時無法運行該功能');
        })
        .finally(() => {
            connection.release();
        })
};

exports.getAdminList = (pageInfo) => {
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
            return connection.query(`
            SELECT
                COUNT(*) AS total_admin
            FROM
                companydb.admin
            WHERE
                admin_role = 1`);
        })
        .then(([rows, field]) => {
            numberOfRows = rows[0].total_admin;
            numberOfPages = Math.ceil(numberOfRows / numberPerPage);
            return connection.query(`
            SELECT
                admin_id,
                admin_name,
                DATE_FORMAT(last_login, '%d-%c-%Y %H:%i:%s') AS last_login
            FROM
                companydb.admin
            WHERE
                admin_role = 1 LIMIT ${limit}`);
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
            throw new Error('系統暫時無法運行該功能');
        })
        .finally(() => {
            connection.release();
        })
};

exports.addNewAdmin = (adminInfo) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT *
            FROM
                companydb.admin
            WHERE
                admin_email = ?
                AND admin_role = 1`, [adminInfo.admin_email]);
        })
        .then(([rows, field]) => {
            if (rows.length) throw new Error('該郵箱已存在，請使用新的郵箱註冊');
            else return connection.query(`
            INSERT INTO
                companydb.admin
            SET ?`, [adminInfo]);
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (`${adminInfo.admin_name} 註冊成功`);
            else throw new Error('資料新增失敗');
        })
        .catch((err) => {
            console.error(err);
            throw new Error('資料新增失敗');
        })
        .finally(() => {
            connection.release();
        })
};

exports.updateAdmin = (adminId, admin_info) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            UPDATE
                companydb.admin
            SET ?
            WHERE
                admin_id = ?`, [admin_info, adminId]);
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (`${admin_info.admin_name} 資料更新成功`);
            else return ('資料沒有異動');
        })
        .catch((err) => {
            console.error(err);
            throw new Error('資料更新失敗');
        })
        .finally(() => {
            connection.release();
        })
};

exports.deleteAdmin = (adminId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT *
            FROM
                companydb.admin
            WHERE
                admin_role = 1`);
        })
        .then(([rows, field]) => {
            if (rows.length <= 2) throw new Error('該平臺需保留至少兩名以上的管理者');
            else return connection.query(`
            DELETE FROM
                companydb.admin
            WHERE
                admin_id = ?`, [adminId]);
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return ('資料刪除成功');
            else throw new Error('資料刪除失敗');
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
};