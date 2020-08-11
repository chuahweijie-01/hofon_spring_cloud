const mysql = require('mysql');
const connectionPool = require('../../conf/db');

exports.add_client = (client_info, privileges) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject('數據庫連接失敗');
            } else {
                connection.query(`SELECT COUNT(*) AS total_client FROM companydb.admin WHERE company_id = ?`, client_info.company_id, (error, result) => {
                    if (error) {
                        console.error('SQL Error : ', error);
                        reject('數據庫連接失敗');
                    } else {
                        if(result[0].total_client > 10) {
                            reject("你已超過可以注冊的管理者上限")
                        } else {
                            connection.query(`SELECT * FROM companydb.admin WHERE admin_email = ?`, [client_info.admin_email], (error, result) => {
                                if (error) {
                                    console.error('SQL Error : ', error);
                                    reject('數據庫連接失敗');
                                } else if (result.length > 0) {
                                    reject('該郵箱已存在數據庫，請使用新的郵箱注冊');
                                } else {
                                    connection.query(`INSERT INTO companydb.admin SET ?`, client_info, (error, result) => {
                                        if (error) {
                                            console.log(error);
                                            reject('數據庫連接失敗');
                                        } else if (result.affectedRows === 1) {
                                            for (var i = 0; i < privileges.length; i++) {
                                                connection.query(`INSERT INTO companydb.admin_privileges (admin_id, privileges_id) VALUES (?,?)`, [result.insertId, privileges[i]], (error, result_privileges) => {
                                                    if (error) {
                                                        console.log(error);
                                                        reject('數據庫連接失敗');
                                                    } else if (result_privileges.affectedRows === 1) {
                                                        resolve(`${client_info.admin_name} 注冊成功`);
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                    connection.release();
                })
            }
        });
    });
};

exports.get_company_name = () => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject('數據庫連接失敗');
            } else {
                connection.query('SELECT company_id, company_name FROM companydb.company', (error, result) => {
                    if (error) {
                        console.error('SQL Error : ', error);
                        reject('數據庫連接失敗');
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

exports.get_privileges = () => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query('SELECT privileges_id, privileges_name, privileges_description FROM companydb.privileges', (error, result) => {
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

exports.client_list = () => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query(`SELECT admin.admin_id, admin.admin_name, company.company_name
                                  FROM companydb.admin AS admin
                                  JOIN companydb.company AS company
                                  ON admin.company_id = company.company_id
                                  WHERE admin_role = 0`, (error, result) => {
                    if (error) {
                        console.error('SQL Error : ', error);
                        reject('數據庫連接失敗');
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

exports.client_list_company = (company_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query(`SELECT admin_id, admin_name, created_date
                                  FROM companydb.admin
                                  WHERE company_id = ?`, [company_id], (error, result) => {
                    if (error) {
                        console.error('SQL Error : ', error);
                        reject('數據庫連接失敗');
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
}

exports.client = (client_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query(`SELECT admin.admin_id, admin.admin_name, admin_email, privileges.privileges_id, privileges.privileges_name, privileges.privileges_description
                                  FROM companydb.admin AS admin
                                  JOIN companydb.admin_privileges AS admin_privileges
                                  ON admin.admin_id = admin_privileges.admin_id
                                  JOIN companydb.privileges as privileges
                                  ON admin_privileges.privileges_id = privileges.privileges_id
                                  WHERE admin.admin_id = ?`, [client_id], (error, result) => {
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

exports.client_delete = (client_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query('DELETE FROM companydb.admin WHERE admin_id = ?', [client_id], (error, result) => {
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

exports.client_update = (client_id, client_info, privileges) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query('UPDATE companydb.admin SET ? WHERE admin_id = ?', [client_info, client_id], (error, result) => {
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