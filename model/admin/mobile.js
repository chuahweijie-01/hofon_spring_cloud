const connectionPool = require('../../conf/db');

exports.updateAppInterfaceSetting = (settingInfo, companyId, settingInfoWithCompanyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT *
            FROM
                companydb.mobile_setting
            WHERE
                company_id = ?`, companyId);
        })
        .then(([rows, field]) => {
            if (rows.length) {
                return connection.query(`
                UPDATE
                    companydb.mobile_setting
                SET ?
                WHERE
                    company_id = ?`, [settingInfo, companyId]);
            } else {
                return connection.query(`
                INSERT INTO
                    companydb.mobile_setting
                SET ?`, [settingInfoWithCompanyId]);
            }
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return (`軟體設定成功`);
            else throw new Error(`軟體設定失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('系統暫時無法運行該功能'); F
        })
        .finally(() => {
            connection.release();
        })
};

exports.getAppInterfaceSetting = (companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                header_color,
                body_color,
                footer_color,
                button_1_color
            FROM
                companydb.mobile_setting
            WHERE
                company_id = ?`, [companyId]);
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('系統暫時無法運行該功能');
        })
        .finally(() => {
            connection.release();
        })
}