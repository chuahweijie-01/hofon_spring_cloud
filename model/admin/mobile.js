const connectionPool = require('../../conf/db');

exports.mobile_create = (setting_info, company_id, setting_info_company) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT * FROM companydb.mobile_setting WHERE company_id = ?`, company_id)
        })
        .then(([rows, field]) => {
            if (rows.length) return connection.query(`UPDATE companydb.mobile_setting SET ? WHERE company_id = ?`, [setting_info, company_id])
            else return connection.query(`INSERT INTO companydb.mobile_setting SET ?`, [setting_info_company])
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return (`軟體設定成功`);
            else throw new Error(`軟體設定失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('系統暫時無法運行該功能'); F
        })
        .finally(() => {
            connection.release();
        })
};

exports.mobile_display_list = (company_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT mobile.header_color, body_color, footer_color, button_1_color,
                                     company_category.category_id, category.category_name, company_category.button_color
                                     FROM companydb.mobile_setting AS mobile
                                     JOIN companydb.company_category AS company_category ON mobile.company_id = company_category.company_id
                                     JOIN productdb.category AS category ON company_category.category_id = category.category_id
                                     WHERE mobile.company_id = ?`, [company_id])
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('系統暫時無法運行該功能'); F
        })
        .finally(() => {
            connection.release();
        })
}