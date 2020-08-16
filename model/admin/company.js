const mysql = require('mysql');
const connectionPool = require('../../conf/db');
const connection = require('../../conf/db');

exports.add_company = (company_info) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`INSERT INTO companydb.company SET ?`, [company_info])
                .then((result) => {
                    if (result[0].affectedRows === 1) return (`${company_info.company_name} 注冊成功`);
                    else throw new Error(`資料新增失敗`);
                })
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料新增失敗');
        })
};

exports.company_list = () => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT * , DATE_FORMAT(created_date, '%W %M %Y %H:%i:%s') AS created_date FROM companydb.company`)
                .then(([rows, field]) => {
                    return (rows);
                })
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('系統暫時無法運行該功能');
        })
};

exports.company = (company_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT * FROM companydb.company WHERE company_id = ?`, [company_id])
                .then(([rows, field]) => {
                    return (rows);
                })
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('系統暫時無法運行該功能');
        })
};

exports.company_update = (company_id, company_info) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`UPDATE companydb.company SET ? WHERE company_id = ?`, [company_info, company_id])
                .then((result) => {
                    if (result[0].info.match('Changed: 1')) return (`${company_info.company_name} 資料更新成功`);
                    else return (`資料沒有異動`);
                })
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料更新失敗');
        })
};

exports.company_delete = (company_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`DELETE FROM companydb.company WHERE company_id = ?`, [company_id])
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
            throw new Error('資料刪除失敗');
        })
};