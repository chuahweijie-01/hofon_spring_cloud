const mysql = require('mysql');
const connectionPool = require('../../conf/db');
const { promiseImpl } = require('ejs');
const connection = require('../../conf/db');

exports.product_create = (product_info) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if(connectionError) {
                reject('數據庫連接失敗');
            } else {
                connection.query(`SELECT COUNT(*) as total_product FROM productdb.product WHERE category_id = ? AND company_id = ?`, [product_info.category_id, product_info.company_id], (error, result) => {
                    if (error) {
                        console.error('SQL Error : ', error);
                        reject('總數計算失敗');
                    } else if (result[0].total_product >= 8) {
                        reject("該類別已超過可以新增的產品上限")
                    } else {
                        connection.query(`INSERT INTO productdb.product SET ?`, product_info, (error, result) => {
                            if(error) {
                                console.error('SQL Error : ', error);
                                reject(error);
                            } else if (result.affectedRows === 1){
                                resolve(`已新增${product_info.product_name}`);
                            }
                        });
                    }
                    connection.release();
                });
            }
        });
    });
};

exports.category_list = () => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if(connectionError) {
                reject('數據庫連接失敗')
            } else {
                connection.query(`SELECT category_id, category_name FROM productdb.category`, (error, result) => {
                    if (error) {
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
}

exports.product_list = (company_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if(connectionError) {
                reject('數據庫連接失敗')
            } else {
                connection.query(`SELECT product.product_id, product.product_name, product.product_stock, category.category_name, DATE_FORMAT(product.last_update, '%W %M %Y %H:%i:%s') AS last_update
                                  FROM productdb.product AS product
                                  JOIN productdb.category AS category
                                  ON product.category_id = category.category_id
                                  JOIN companydb.company AS company
                                  ON product.company_id = company.company_id
                                  WHERE company.company_id = ? AND product.product_status = 1`, [company_id], (error, result) => {
                    if (error) {
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
}

exports.product = (product_id, company_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if(connectionError) {
                reject('數據庫連接失敗')
            } else {
                connection.query(`SELECT product_id, product_name, product_stock, product_description, product_rating, product_price, category_id
                                  FROM productdb.product
                                  WHERE product.product_id = ? AND company_id = ?`, [product_id, company_id], (error, result) => {
                    if (error) {
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
}

exports.product_update = (product_id, product_info) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if(connectionError) {
                reject('數據庫連接失敗');
            } else {
                connection.query(`UPDATE productdb.product SET ? WHERE product_id = ?`, [product_info, product_id], (error, result) => {
                    if (error) {
                        console.error('SQL Error : ', error);
                        reject('資料更新失敗，請稍後再試');
                    } else if (result.message.match('Changed: 1')) {
                        resolve('資料更新成功');
                    }
                    connection.release();
                })
            }
        })
    })
}

exports.product_delete = (product_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query('DELETE FROM productdb.product WHERE product_id = ?', [product_id], (error, result) => {
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