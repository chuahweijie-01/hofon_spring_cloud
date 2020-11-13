const connectionPool = require('../../conf/db');

exports.registerUser = (userInfo, companyOfficialId) => {
    var connection, companyId;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`START TRANSACTION`);
        })
        .then((result) => {
            return connection.query(`SELECT * FROM userdb.user AS user
                                    JOIN userdb.user_company AS user_company ON user.user_id = user_company.user_id
                                    JOIN companydb.company AS company ON user_company.company_id = company.company_id
                                    WHERE user.user_email = ? AND company.company_official_id = ?`, [userInfo.user_email, companyOfficialId]);
        })
        .then(([rows, field]) => {
            if (rows.length)
                throw new Error('帳戶已被使用，請使用新的郵箱進行注冊。');
            else
                return connection.query(`SELECT company_id FROM companydb.company WHERE company_official_id = ?`, [companyOfficialId]);
        })
        .then(([rows, field]) => {
            if (rows.length) {
                companyId = rows[0].company_id;
                return connection.query(`INSERT INTO userdb.user SET ?`, [userInfo]);
            }
            else
                throw new Error('注意！該公司并未注冊雲端系統。');
        })
        .then((result) => {
            if (result[0].affectedRows === 1)
                return connection.query(`INSERT INTO userdb.user_company (user_id, company_id) VALUES (?,?)`, [userInfo.user_id, companyId]);
            else
                throw new Error('帳號注冊失敗');
        })
        .then((result) => {
            if (result[0].affectedRows == 1)
                return connection.query(`COMMIT`);
            else
                throw new Error('帳號注冊失敗');
        })
        .then((result) => {
            return ('帳號注冊成功');
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err);
        })
        .finally(() => {
            connection.release();
        })
}