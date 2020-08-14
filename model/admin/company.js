const mysql = require('mysql');
const connectionPool = require('../../conf/db');

exports.add_company = (company_info) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) reject(connectionError);
            return connection.promise().query(``)




            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query('INSERT INTO companydb.company SET ?', company_info, (error, result) => {
                    if (error) {
                        console.error('SQL Error : ', error);
                        reject('公司新增失敗');
                    } else if (result.affectedRows === 1) {
                        resolve(`${company_info.company_name} 注冊成功`);
                    }
                    connection.release();
                });
            }
        });
    });
};

exports.company_list = () => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) reject(connectionError);
            return connection.promise().query(`SELECT * FROM companydb.company`)
                .then(([rows, field]) => {
                    resolve(rows);
                })
                .catch((err) => {
                    console.error('CATCH ERROR : ', err);
                    reject('資料選取失敗');
                })
                .finally(() => {
                    connection.release();
                })
        });
    });
};

exports.company = (company_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) reject(connectionError);
            return connection.promise().query(`SELECT * FROM companydb.company WHERE company_id = ?`, [company_id])
            .then(([rows, field]) => {
                resolve(rows);
            })
            .catch((err) => {
                console.error('CATCH ERROR : ', err);
                reject('資料選取失敗');
            })
            .finally(() => {
                connection.release();
            })
        });
    });
};

exports.company_update = (company_id, company_info) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query('UPDATE companydb.company SET ? WHERE company_id = ?', [company_info, company_id], (error, result) => {
                    console.log('資料更新失敗，請稍後再試')
                    if (error) {
                        console.error('SQL Error : ', error);
                        reject('數據庫連接失敗');
                    } else if (result.affectedRows === 0) {
                        resolve('資料更新失敗，請稍後再試')
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

exports.company_delete = (company_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query('DELETE FROM companydb.company WHERE company_id = ?', [company_id], (error, result) => {
                    if (error) {
                        console.error('SQL Error : ', error);
                        reject('資料刪除失敗，請稍後再試');
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