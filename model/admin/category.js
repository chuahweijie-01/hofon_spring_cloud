const connectionPool = require('../../conf/db');

exports.category_create = (category_name, company_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject('數據庫連接失敗');
            } else {
                connection.query(`SELECT * FROM productdb.category
                                  WHERE category_name = ?`, [category_name], (error, result) => {
                    if (error) {
                        console.error('SQL Error : ', error);
                        reject('無法選擇所有已添加的類別');
                    } else if (result.length > 0) {
                        reject('該類別已存在數據庫，請新增新的類別');
                    } else {
                        connection.query(`INSERT INTO productdb.category (category_name) VALUES (?)`, [category_name], (error, result) => {
                            if (error) {
                                console.log(error);
                                reject('類別添加失敗');
                            } else if (result.affectedRows === 1) {
                                company = [];
                                for (var i = 0; i < company_id.length; i++) {
                                    company.push([company_id[i], result.insertId])
                                }
                                connection.query(`INSERT INTO companydb.company_category (company_id, category_id) VALUES ?`, [company], (error, result) => {
                                    if (error) {
                                        console.log(error);
                                        reject('關聯表新增失敗');
                                    } else if (result.affectedRows >= 1) {
                                        resolve(`已新增${category_name}`);
                                    }
                                });
                            }
                        });
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
            if (connectionError) {
                reject('數據庫連接失敗');
            } else {
                connection.query(`SELECT company_id, company_name FROM companydb.company`, (error, result) => {
                    if (error) {
                        console.error('SQL Error : ', error);
                        reject('資料選取失敗');
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

exports.category_display = (category_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query(`SELECT category.category_id, category.category_name, company.company_id, company.company_name
                                  FROM productdb.category AS category
                                  JOIN companydb.company_category AS company_category
                                  ON category.category_id = company_category.category_id
                                  JOIN companydb.company as company
                                  ON company_category.company_id = company.company_id
                                  WHERE category.category_id = ?`, [category_id], (error, result) => {
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

exports.category_display_list = () => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject('數據庫連接失敗');
            } else {
                connection.query(`SELECT COUNT(*) AS total_company, company_category.category_id, category.category_name, category.last_update
                                  FROM companydb.company_category AS company_category
                                  JOIN productdb.category AS category
                                  ON company_category.category_id = category.category_id
                                  GROUP BY category.category_name`, (error, result) => {
                    if (error) {
                        console.error('SQL Error : ', error);
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

exports.category_update = (category_info, company_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject('數據庫連接失敗');
            } else {
                connection.query(`DELETE FROM companydb.company_category
                                  WHERE category_id = ?`, [category_info.category_id], (error, result) => {
                    if (error) {
                        console.error('SQL Error : ', error);
                        reject('關聯表刪除失敗');
                    } else if (result.affectedRows >= 1) {
                        company = [];
                        for (var i = 0; i < company_id.length; i++) {
                            company.push([company_id[i], category_info.category_id])
                        }
                        connection.query(`INSERT INTO companydb.company_category (company_id, category_id) VALUES ?`, [company], (error, result_privileges) => {
                            console.log(result_privileges)
                            if (error) {
                                console.log('關聯表新增失敗');
                                reject('數據庫連接失敗');
                            } else if (result_privileges.affectedRows >= 1) {
                                connection.query(`UPDATE productdb.category SET ?
                                                  WHERE category_id = ?`, [category_info, category_info.category_id], (error, result) => {
                                    if (error) {
                                        console.error('SQL Error : ', error);
                                        reject('類別新增失敗');
                                    } else if (result.affectedRows === 0) {
                                        resolve('資料更新失敗，請稍後再試')
                                    } else if (result.message.match('Changed: 1')) {
                                        resolve('資料更新成功')
                                    }
                                    else {
                                        resolve('關聯公司更新成功');
                                    }
                                });
                            }
                        });
                    }
                    connection.release();
                });
            }
        });
    });
};

exports.category_delete = (category_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query(`DELETE FROM productdb.category
                                  WHERE category_id = ?`, [category_id], (error, result) => {
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