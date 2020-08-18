const connectionPool = require('../../conf/db');

exports.insert = (user) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT * FROM companydb.admin WHERE admin_email = ? AND admin_role = 1`, user.username)
                .then(([rows, field]) => {
                    if (rows.length) throw new Error(`該郵箱已存在，請使用新的郵箱註冊`);
                    else return connection.query(`INSERT INTO companydb.admin SET ?`, [user])
                })
                .then((result) => {
                    if (result[0].affectedRows === 1) return (`${user.username} 註冊成功`);
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