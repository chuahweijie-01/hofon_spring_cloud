const connectionPool = require('../../conf/db');

exports.getCompanyList = (user_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                company.company_id,
                company.company_name,
                mobile.header_color,
                mobile.body_color,
                mobile.footer_color,
                mobile.button_1_color
            FROM
                companydb.company AS company
            JOIN
                companydb.mobile_setting AS mobile
                ON company.company_id = mobile.company_id
            JOIN
                userdb.user_company AS user_company
                ON user_company.company_id = company.company_id
            JOIN
                userdb.user AS user
                ON user.user_id = user_company.user_id
            WHERE
                user.user_id = ?`, [user_id])
        })
        .then(([rows, field]) => {
            if (!rows.length) throw new Error(`該用戶不存在任何公司的資料庫`);
            else return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err.message}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release()
        })
}

exports.getCompanyDetails = (company_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                company_name,
                company_logo,
                company_description,
                company_phone,
                company_address,
                company_address_another,
                company_contact_name,
                company_contact_position,
                company_contact_phone,
                company_contact_fax
            FROM
                companydb.company
            WHERE
                company_id = ?`, [company_id])
        })
        .then(([rows, field]) => {
            if (!rows.length) throw new Error(`此公司不存在該商城系統`);
            else return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err.message}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release()
        })
}