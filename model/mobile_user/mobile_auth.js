const connectionPool = require('../../conf/db');

exports.auth = (user_info) => {
    var connection;
    var user;
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
            user = rows[0].user_id;
            if (!rows.length) throw new Error(`該用戶不存在資料庫裏`);
            //else if (rows[0].user_is_logged_in == 1) throw new Error(`請先登出系統再進行登錄`);
            //else return connection.query(`UPDATE userdb.user SET user_is_logged_in = 1, last_login = NOW() WHERE user_id = ?`, user)
            else return connection.query(`UPDATE userdb.user SET last_login = NOW() WHERE user_id = ?`, [user])
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (user);
            else return (`無法登入系統`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err.message}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release()
        })
}

exports.register = (user_info) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT * FROM userdb.user WHERE user_email = ?`, [user_info.user_email]);
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

exports.logout = (user_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`UPDATE userdb.user SET user_is_logged_in = 0 WHERE user_id = ?`, user_id)
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (`已登出系統`);
            else throw new Error (`無法登出系統`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err);
        })
        .finally(() => {
            connection.release();
        })
}