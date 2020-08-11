const mysql = require('mysql');
const connectionPool = require('../../conf/db');

exports.add_admin = (admin_info) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject('數據庫連接失敗');
            } else {
                connection.query('SELECT * FROM companydb.admin WHERE admin_email = ?', [admin_info.admin_email], (error, result) => {
                    if (error) {
                        console.error('SQL Error : ', error);
                        reject('數據庫連接失敗');
                    } else if (result.length > 0) {
                        reject('該郵箱已存在數據庫，請使用新的郵箱注冊');
                    } else {
                        connection.query('INSERT INTO companydb.admin SET ?', admin_info, (error, result) => {
                            if (error) {
                                console.error('SQL Error : ', error);
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

exports.admin = (admin_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query('SELECT * FROM companydb.admin WHERE admin_id = ?', [admin_id], (error, result) => {
                    if (error) {
                        console.error('SQL Error : ', error);
                        reject(error);
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

exports.admin_list = () => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query('SELECT * FROM companydb.admin WHERE admin_role = 1', (error, result) => {
                    if (error) {
                        console.error('SQL Error : ', error);
                        reject(error);
                    } else if (result.length > 0) {
                        resolve(result)
                    } else {
                        resolve(result);
                        //reject(1)
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
                connection.query('DELETE FROM companydb.admin WHERE admin_id = ?', [admin_id], (error, result) => {
                    if (error) {
                        console.error('SQL Error : ', error);
                        reject('數據庫連接失敗');
                    } else if (result.affectedRows === 1) {
                        resolve('資料刪除成功')
                    } else {
                        reject('資料刪除失敗，請稍後再試');
                    }
                    connection.release();
                });
            }
        });
    });
};