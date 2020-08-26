const connectionPool = require('../../conf/db');

exports.admin_create = (admin_info) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT * FROM companydb.admin WHERE admin_email = ? AND admin_role = 1`, [admin_info.admin_email])
                .then(([rows, field]) => {
                    if (rows.length) throw new Error(`該郵箱已存在，請使用新的郵箱註冊`);
                    else return connection.query(`INSERT INTO companydb.admin SET ?`, [admin_info])
                })
                .then((result) => {
                    if (result[0].affectedRows === 1) return (`${admin_info.admin_name} 註冊成功`);
                    else throw new Error(`資料新增失敗`);
                })
                .finally(() => {
                    connection.release();
                })
        }, err => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`資料新增失敗`);
        })
};

exports.admin_display = (admin_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT * FROM companydb.admin WHERE admin_id = ?`, [admin_id])
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
};

exports.admin_display_list = (page_info) => {
    var connection;
    var page_size = 10;
    var number_of_rows, number_of_pages;
    var number_per_page = parseInt(page_size, 10) || 1;
    var page = parseInt(page_info.page, 10) || 1;
    var skip = (page - 1) * number_per_page;
    var limit = `${skip} , ${number_per_page}`;

    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT COUNT(*) AS total_admin FROM companydb.admin WHERE admin_role = 1`)
        })
        .then(([rows, field]) => {
            number_of_rows = rows[0].total_admin;
            number_of_pages = Math.ceil(number_of_rows / number_per_page);
            return connection.query(`SELECT admin_id, admin_name, DATE_FORMAT(last_login, '%D %M %Y %H:%i:%s') AS last_login
                                     FROM companydb.admin WHERE admin_role = 1 LIMIT ${limit}`)
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
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
};

exports.admin_update = (admin_id, admin_info) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`UPDATE companydb.admin SET ? WHERE admin_id = ?`, [admin_info, admin_id])
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (`${admin_info.admin_name} 資料更新成功`);
            else return (`資料沒有異動`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`資料更新失敗`);
        })
        .finally(() => {
            connection.release();
        })
};

exports.admin_delete = (admin_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`DELETE FROM companydb.admin WHERE admin_id = ?`, [admin_id])
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (`資料刪除成功`);
            else throw new Error(`資料刪除失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`資料刪除失敗`);
        })
        .finally(() => {
            connection.release();
        })
};