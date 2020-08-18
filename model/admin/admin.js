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
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT * FROM companydb.admin WHERE admin_id = ?`, [admin_id])
                .then(([rows, field]) => {
                    return (rows);
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

exports.admin_display_list = () => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT admin_id, admin_name, DATE_FORMAT(last_login, '%W %M %Y %H:%i:%s') AS last_login FROM companydb.admin WHERE admin_role = 1`)
                .then(([rows, field]) => {
                    return (rows);
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

exports.admin_update = (admin_id, admin_info) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`UPDATE companydb.admin SET ? WHERE admin_id = ?`, [admin_info, admin_id])
                .then((result) => {
                    if (result[0].info.match('Changed: 1')) return (`${admin_info.admin_name} 資料更新成功`);
                    else return (`資料沒有異動`);
                })
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`資料更新失敗`);
        })
};

exports.admin_delete = (admin_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`DELETE FROM companydb.admin WHERE admin_id = ?`, [admin_id])
                .then((result) => {
                    if (result[0].affectedRows === 1) return (`資料刪除成功`);
                    else throw new Error(`資料刪除失敗`);
                })
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`資料刪除失敗`);
        })
};