const connection = require('../../conf/db');
const connectionPool = require('../../conf/db');

exports.ads_create = (advertisement_info) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`INSERT INTO companydb.advertisement SET ? `, [advertisement_info])
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return (`${advertisement_info.advertisement_name} 新增成功`);
            else throw new Error(`資料新增失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料新增失敗');
        })
        .finally(() => {
            connection.release();
        })
};

exports.ads_display_list = (company_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT advertisement_id, advertisement_name, DATE_FORMAT(last_update, '%D %M %Y %H:%i:%s') AS last_update
                                     FROM companydb.advertisement WHERE company_id = ?`, [company_id])
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('系統暫時無法運行該功能');
        })
        .finally(() => {
            connection.release();
        })
}

exports.ads_display = (advertisement_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT * FROM companydb.advertisement WHERE advertisement_id = ?`, [advertisement_id])
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
};

exports.ads_update = (advertisement_id, advertisement_info) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`UPDATE companydb.advertisement SET ? WHERE advertisement_id = ?`, [advertisement_info, advertisement_id])
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (`${advertisement_info.advertisement_name} 資料更新成功`);
            else return (`資料沒有異動`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
};

exports.ads_delete = (advertisement_id) => {
    var connection, image_path;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT advertisement_image FROM companydb.advertisement WHERE advertisement_id = ?`, [advertisement_id])
        })
        .then(([rows, field]) => {
            image_path = rows;
            return connection.query(`DELETE FROM companydb.advertisement WHERE advertisement_id = ?`, [advertisement_id])
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (image_path);
            else throw new Error(`資料刪除失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
};

exports.ads_image_identify = (advertisement_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT advertisement_image FROM companydb.advertisement WHERE advertisement_id = ?`, [advertisement_id])
        })
        .then(([rows, field]) => {
            return rows;
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
}

exports.ads_image_update = (advertisement_id, advertisement_image) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`UPDATE companydb.advertisement SET advertisement_image = ? WHERE advertisement_id = ?`, [advertisement_image, advertisement_id])
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (`圖片更新成功`);
            else return (`資料沒有異動`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
}