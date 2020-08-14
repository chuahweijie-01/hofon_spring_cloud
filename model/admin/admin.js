const connectionPool = require('../../conf/db');

exports.admin_create = (admin_info) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) reject(`數據庫連接失敗`);
            return connection.promise().query(`SELECT * FROM companydb.admin WHERE admin_email = ? AND admin_role = 1`, [admin_info.admin_email])
                .then(([rows, field]) => {
                    if (rows.length) reject(`該郵箱已存在，請使用新的郵箱注冊`);
                    else return connection.promise().query(`INSERT INTO companydb.admin SET ?`, [admin_info])
                })
                .then((result) => {
                    if (result[0].affectedRows === 1) resolve(`${admin_info.admin_name} 注冊成功`);
                    else reject(`資料新增失敗`);
                })
                .catch((err) => {
                    console.error(`CATCH ERROR : ${err}`);
                    reject(`系統暫時無法運行該功能`);
                })
                .finally(() => {
                    connection.release();
                })
        });
    });
};

exports.admin_display = (admin_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) reject(`數據庫連接失敗`);
            return connection.promise().query(`SELECT * FROM companydb.admin WHERE admin_id = ?`, [admin_id])
                .then(([rows, field]) => {
                    resolve(rows);
                })
                .catch((err) => {
                    console.error(`CATCH ERROR : ${err}`);
                    reject(`系統暫時無法運行該功能`);
                })
                .finally(() => {
                    connection.release();
                })
        });
    });
};

exports.admin_display_list = () => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) reject(`數據庫連接失敗`);
            return connection.promise().query(`SELECT admin_id, admin_name, DATE_FORMAT(last_login, '%W %M %Y %H:%i:%s') AS last_login FROM companydb.admin WHERE admin_role = 1`)
                .then(([rows, field]) => {
                    resolve(rows)
                })
                .catch((err) => {
                    console.error(`CATCH ERROR : ${err}`);
                    reject(`系統暫時無法運行該功能`);
                })
                .finally(() => {
                    connection.release();
                })
        });
    });
};

exports.admin_update = (admin_id, admin_info) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            connectionPool.getConnection((connectionError, connection) => {
                if (connectionError) reject(`數據庫連接失敗`);
                return connection.promise().query(`UPDATE companydb.admin SET ? WHERE admin_id = ?`, [admin_info, admin_id])
                    .then((result) => {
                        if (result[0].affectedRows === 0) reject(`資料更新失敗`);
                        else if (result[0].info.match('Changed: 1')) resolve(`${admin_info.admin_name} 資料更新成功`);
                        else resolve(`資料沒有異動`);
                    })
                    .catch((err) => {
                        console.error(`CATCH ERROR : ${err}`);
                        reject(`資料更新失敗`);
                    })
                    .finally(() => {
                        connection.release();
                    })
            });
        });
    });
};

exports.admin_delete = (admin_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) reject(`數據庫連接失敗`);
            return connection.promise().query(`DELETE FROM companydb.admin WHERE admin_id = ?`, [admin_id])
                .then((result) => {
                    if (result[0].affectedRows === 1) resolve(`資料刪除成功`);
                    else reject(`資料刪除失敗`);
                })
                .catch((err) => {
                    console.error(`SQL ERROR : ${err}`);
                    reject(`資料刪除失敗`);
                })
                .finally(() => {
                    connection.release();
                })
        });
    });
};