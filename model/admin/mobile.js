const connectionPool = require('../../conf/db');

exports.mobile_create = (setting_info, company_id, setting_info_company) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT * FROM companydb.mobile_setting WHERE company_id = ?`, company_id)
                .then(([rows, field]) => {
                    if (rows.length) return connection.query(`UPDATE companydb.mobile_setting SET ? WHERE company_id = ?`, [setting_info, company_id])
                    else return connection.query(`INSERT INTO companydb.mobile_setting SET ?`, [setting_info_company])
                })
                .then((result) => {
                    if (result[0].affectedRows >= 1) return (`軟體設定成功`);
                    else throw new Error(`軟體設定失敗`);
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('系統暫時無法運行該功能'); F
        })
};

exports.mobile_display_list = (company_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT header_color, body_color, footer_color, button_1_color FROM companydb.mobile_setting WHERE company_id = ?`, [company_id])
                .then(([rows, field]) => {
                    return (rows);
                })
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('系統暫時無法運行該功能'); F
        })
}