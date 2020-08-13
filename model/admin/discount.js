const connectionPool = require('../../conf/db');
const connection = require('../../conf/db');
const { discount_display } = require('../../controller/admin/discount');
const { resolveInclude } = require('ejs');

exports.discount_create = (discount_info, product_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject('數據庫連接失敗');
            } else {
                connection.query('INSERT INTO productdb.discount SET ?', discount_info, (error, result) => {
                    if (error) {
                        console.log(error)
                        reject('數據庫連接失敗');
                    } else if (result.affectedRows === 1) {
                        //SHOULD HAVE BETTER WAY TO OPERATE
                        for (var i = 0; i < product_id.length; i++) {
                            connection.query(`UPDATE productdb.product SET discount_id = ? WHERE product_id = ?`, [result.insertId, product_id[i]], (error, results) => {
                                if (error) {
                                    console.log(error)
                                    reject('數據庫連接失敗');
                                } else {
                                    resolve(`已成功添加${discount_info.discount_name}促銷活動`);
                                }
                            })
                        }
                    }
                    connection.release();
                });
            }
        });
    });
};

exports.discount_display_list = (company_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject('數據庫連接失敗');
            } else {
                connection.query(`SELECT COUNT(*) AS total_product, discount.discount_id, discount.discount_name, discount.discount_percent
                                  FROM productdb.discount AS discount
                                  LEFT JOIN productdb.product AS product
                                  ON discount.discount_id = product.discount_id
                                  WHERE product.company_id = ?
                                  GROUP BY discount.discount_name`, [company_id], (error, result) => {
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
}

exports.product_list = (company_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject('數據庫連接失敗');
            } else {
                connection.query(`SELECT product.product_id, product.product_name, discount.discount_name, discount.discount_id
                                  FROM productdb.product AS product
                                  LEFT JOIN productdb.discount AS discount
                                  ON product.discount_id = discount.discount_id
                                  WHERE product.company_id = ? AND product.product_status = 1`, [company_id], (error, result) => {
                    if (error) {
                        reject('系統暫時無法運行該功能');
                    } else if (result.length > 0) {
                        resolve(result);
                    } else {
                        resolve(result);
                    }
                });
            }
        });
    });
}

exports.discount_display = (discount_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject('數據庫連接失敗');
            } else {
                connection.query(`SELECT discount.discount_id, discount.discount_name, discount.discount_percent, product.product_id
                                  FROM productdb.discount AS discount
                                  JOIN productdb.product AS product
                                  ON product.discount_id = discount.discount_id
                                  WHERE discount.discount_id = ?`, [discount_id], (error, result) => {
                    if (error) {
                        console.log(error)
                        reject('數據庫連接失敗')
                    } else if (result.length > 0) {
                        resolve(result)
                    } else {
                        resolve(result);
                    }
                    connection.release();
                })
            }
        })
    })
}

exports.discount_update = (discount_info, discount_id, product_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject('數據庫連接失敗');
            } else {
                connection.query(`UPDATE productdb.discount SET ?
                                  WHERE discount_id = ?`, [discount_info, discount_id], (error, result) => {
                    if (error) {
                        console.error('SQL Error : ', error);
                        reject('促銷資料更新失敗');
                    } else {
                        connection.query(`UPDATE productdb.product
                                          SET discount_id = null, product_latest_price = product_price
                                          WHERE discount_id = ?`, [discount_id], (error, result) => {
                            if (error) {
                                console.error('SQL Error : ', error);
                                reject('產品資料更新失敗');
                            } else if (result.affectedRows >= 1) {
                                for (i = 0; i < product_id.length; i++) {
                                    connection.query(`UPDATE productdb.product
                                                      SET discount_id = ?
                                                      WHERE product_id = ?`, [discount_id, product_id[i]], (error, results) => {
                                        if (error) {
                                            console.log(error)
                                            reject('數據庫連接失敗');
                                        } else {
                                            connection.query(`UPDATE productdb.product AS product
                                                              JOIN productdb.discount AS discount
                                                              ON product.discount_id = discount.discount_id
                                                              SET product.product_latest_price = product.product_price - product.product_price * (discount.discount_percent) / 100
                                                              WHERE product_id = ?`, [product_id[i]], (error, result) => {
                                                if (error) {
                                                    console.error('SQL Error : ', error);
                                                    reject('產品資料更新失敗');
                                                } else if (result.affectedRows >= 1) {
                                                    resolve('資料更新成功')
                                                } else {
                                                    resolve('資料無異動')
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            }
        })
    })
}

exports.discount_delete = (discount_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query(`DELETE FROM productdb.discount WHERE discount_id = ?`, [discount_id], (error, result) => {
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
}