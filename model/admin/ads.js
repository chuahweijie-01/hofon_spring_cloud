const connectionPool = require('../../conf/db');

exports.ads_create = (advertisement_info) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`INSERT INTO companydb.advertisement SET ? `, [advertisement_info])
                .then((result) => {
                    if (result[0].affectedRows >= 1) return (`${advertisement_info.advertisement_name} 新增成功`);
                    else throw new Error(`資料新增失敗`);
                })
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料新增失敗');
        })
};

exports.ads_display_list = (company_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT advertisement_id, advertisement_name,
                                     DATE_FORMAT(last_update, '%W %M %Y %H:%i:%s') AS last_update FROM companydb.advertisement WHERE company_id = ?`, [company_id])
                .then(([rows, field]) => {
                    return (rows);
                })
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('系統暫時無法運行該功能');
        })
}

exports.ads_display = (advertisement_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT * FROM companydb.advertisement WHERE advertisement_id = ?`, [advertisement_id])
                .then(([rows, field]) => {
                    return (rows);
                })
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('系統暫時無法運行該功能');
        })
};

exports.ads_update = (advertisement_id, advertisement_info) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`UPDATE companydb.advertisement SET ? WHERE advertisement_id = ?`, [advertisement_info, advertisement_id])
                .then((result) => {
                    if (result[0].info.match('Changed: 1')) return (`${advertisement_info.advertisement_name} 資料更新成功`);
                    else return (`資料沒有異動`);
                })
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料更新失敗');
        })
};

exports.ads_delete = (advertisement_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`DELETE FROM companydb.advertisement WHERE advertisement_id = ?`, [advertisement_id])
                .then((result) => {
                    if (result[0].affectedRows === 1) return (`資料刪除成功`);
                    else throw new Error(`資料刪除失敗`);
                })
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料刪除失敗');
        })
};