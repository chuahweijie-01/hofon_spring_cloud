const connectionPool = require('../../conf/db');

/*exports.auth = (user_info) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT * FROM userdb.user WHERE user_email = ?`, [user_info.user_email])
                .then(([rows, field]) => {
                    if (!rows.length) throw new Error(`該用戶不存在資料庫裏`);
                    else return (rows);
                })
                .finally(() => {
                    connection.release()
                })
        }, err => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`數據庫連接失敗`);
        })
}*/

exports.auth = (user_info) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT * FROM userdb.user WHERE user_email = ?`, [user_info.user_email])
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`數據庫連接失敗`);
        })
        .then(([rows, field]) => {
            if (!rows.length) throw new Error(`該用戶不存在資料庫裏`);
            else return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err);
        })
        .finally(() => {
            connection.release()
        })
}

/*exports.register = (user_info) => {
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
};*/

exports.register = (user_info) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT * FROM userdb.user WHERE user_email = ?`, user_info.user_email);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`數據庫連接失敗`);
        })
        .then(([rows, field]) => {
            if (rows.length) throw new Error(`該郵箱已存在，請使用新的郵箱註冊`);
            else return connection.query(`INSERT INTO userdb.user SET ?`, [user_info]);
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (`註冊成功`);
            else throw new Error(`資料新增失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err);
        })
        .finally(() => {
            connection.release();
        })
};