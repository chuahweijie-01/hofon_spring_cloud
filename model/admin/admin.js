const connectionPool = require('../../conf/db');

exports.admin_create = (admin_info) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject('數據庫連接失敗');
            } else {
                connection.query(`SELECT * FROM companydb.admin
                                  WHERE admin_email = ?`, [admin_info.admin_email], (error, result) => {
                    if (error) {
                        reject('數據庫連接失敗');
                    } else if (result.length > 0) {
                        reject('該郵箱已存在，請使用新的郵箱注冊');
                    } else {
                        connection.query('INSERT INTO companydb.admin SET ?', admin_info, (error, result) => {
                            if (error) {
                                reject('數據庫連接失敗');
                            } else if (result.affectedRows === 1) {
                                resolve(`${admin_info.admin_name} 注冊成功`);
                            }
                        });
                    }
                })
            }
            connection.release();
        });
    });
};

exports.admin_display = (admin_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query(`SELECT * FROM companydb.admin
                                  WHERE admin_id = ?`, [admin_id], (error, result) => {
                    if (error) {
                        reject('系統暫時無法運行該功能');
                    } else if (result.length > 0) {
                        resolve(result)
                    } else {
                        resolve(result);
                    }
                    connection.release();
                });
            }
        });
    });
};

exports.admin_display_list = () => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query(`SELECT admin_id, admin_name,
                                  DATE_FORMAT(last_login, '%W %M %Y %H:%i:%s') AS last_login 
                                  FROM companydb.admin
                                  WHERE admin_role = 1`, (error, result) => {
                    if (error) {
                        reject('系統暫時無法運行該功能');
                    } else if (result.length > 0) {
                        resolve(result)
                    } else {
                        resolve(result);
                    }
                    connection.release();
                });
            }
        });
    });
};

exports.admin_update = (admin_id, admin_info) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query(`UPDATE companydb.admin SET ?
                                  WHERE admin_id = ?`, [admin_info, admin_id], (error, result) => {
                    if (error) {
                        console.error('SQL Error : ', error);
                        reject('數據庫連接失敗');
                    } else if (result.affectedRows === 0) {
                        resolve('資料更新失敗')
                    } else if (result.message.match('Changed: 1')) {
                        resolve('資料更新成功')
                    }
                    else {
                        resolve('資料無異動');
                    }
                    connection.release();
                });
            }
        });
    });
};

exports.admin_delete = (admin_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query(`DELETE FROM companydb.admin
                                  WHERE admin_id = ?`, [admin_id], (error, result) => {
                    if (error) {
                        reject('數據庫連接失敗');
                    } else if (result.affectedRows === 1) {
                        resolve('資料刪除成功')
                    } else {
                        reject('資料刪除失敗');
                    }
                    connection.release();
                });
            }
        });
    });
};