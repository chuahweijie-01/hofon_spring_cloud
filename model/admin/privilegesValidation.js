const connectionPool = require('../../conf/db');

exports.privilegesCheck = (adminId, privilegesId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                privileges.privileges_id
            FROM
                companydb.privileges AS privileges
            JOIN
                companydb.admin_privileges AS admin_privileges
                USING (privileges_id)
            JOIN
                companydb.admin AS admin
                USING (admin_id)
            WHERE
                admin.admin_id = ?
                AND admin_privileges.privileges_id = ?`, [adminId, privilegesId]);
        })
        .then(([rows, field]) => {
            if (rows.length) return rows
            else throw new Error(`對不起，該帳號無權限使用該功能。`)
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
}