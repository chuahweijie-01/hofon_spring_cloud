const mysql = require('mysql');
const connectionPool = require('../../conf/db');

exports.add_company = (company_info) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) reject(`數據庫連接失敗`);
            return connection.promise().query(`INSERT INTO companydb.company SET ?`, [company_info])
                .then((result) => {
                    if (result[0].affectedRows === 1) resolve(`${company_info.company_name} 注冊成功`);
                    else reject(`資料新增失敗`);
                })
                .catch((err) => {
                    console.error(`SQL ERROR : ${err}`);
                    reject(`資料新增失敗`);
                })
                .finally(() => {
                    connection.release();
                })
        });
    });
};

exports.company_list = () => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) reject(`數據庫連接失敗`);
            return connection.promise().query(`SELECT * FROM companydb.company`)
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

exports.company = (company_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) reject(`數據庫連接失敗`);
            return connection.promise().query(`SELECT *  FROM companydb.company WHERE company_id = ?`, [company_id])
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

exports.company_update = (company_id, company_info) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) reject(`數據庫連接失敗`);
            return connection.promise().query(`UPDATE companydb.company SET ? WHERE company_id = ?`, [company_info, company_id])
                .then((result) => {
                    if (result[0].affectedRows === 0) reject(`資料更新失敗`);
                    else if (result[0].info.match('Changed: 1')) resolve(`${company_info.company_name} 資料更新成功`);
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
};

exports.company_delete = (company_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) reject(`數據庫連接失敗`);
            return connection.promise().query(`DELETE FROM companydb.company WHERE company_id = ?`, [company_id])
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