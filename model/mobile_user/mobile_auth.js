const connectionPool = require('../../conf/db');

exports.auth = (user_info) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT * FROM userdb.user WHERE user_email = ?`, [user_info.user_email])
                .then(([rows, field]) => {
                    if (!rows.length) throw new Error(`該用戶不存在資料庫裏`);
                    else if (rows[0].user_password == user_info.user_password) {
                        return connection.query(`SELECT user.user_id, company.company_id, company.company_name
                                                 FROM companydb.company AS company
                                                 JOIN userdb.user_company AS user_company
                                                 ON user_company.company_id = company.company_id
                                                 JOIN userdb.user AS user
                                                 ON user.user_id = user_company.user_id
                                                 WHERE user.user_id = ?`, [rows[0].user_id])
                    }
                })
                .then(([rows, field]) => {
                    if (!rows.length) throw new Error(`該用戶不存在任何公司的資料庫`);
                    else return (rows);
                })
                .finally(() => {
                    connection.release()
                })
        }, err => {
            throw new Error(`數據庫連接失敗`);
        })
}

exports.register = (user_info) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT * FROM userdb.user WHERE user_email = ?`, user_info.user_email)
                .then(([rows, field]) => {
                    if (rows.length) throw new Error(`該郵箱已存在，請使用新的郵箱註冊`);
                    else return connection.query(`INSERT INTO userdb.user SET ?`, [user_info]);
                })
                .then((result) => {
                    if (result[0].affectedRows === 1) return (`註冊成功`);
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