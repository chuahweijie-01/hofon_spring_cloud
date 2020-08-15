const mysql = require('mysql');
const connectionPool = require('../../conf/db');
const { promiseImpl } = require('ejs');
const connection = require('../../conf/db');

exports.product_create = (product_info) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT COUNT(*) as total_product FROM productdb.product WHERE category_id = ? AND company_id = ?`, [product_info.category_id, product_info.company_id])
                .then(([rows, field]) => {
                    if (rows[0].total_client >= 8) throw new Error(`該類別已超過可以新增的產品上限`);
                    else return connection.query(`INSERT INTO productdb.product SET ?`, [product_info])
                })
                .then((result) => {
                    if (result[0].affectedRows >= 1) return (`${product_info.product_name} 新增成功`);
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

exports.category_list = (company_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT category.category_id, category.category_name
                                     FROM productdb.category AS category
                                     JOIN companydb.company_category AS company_category
                                     ON category.category_id = company_category.category_id
                                     WHERE company_category.company_id = ?`, [company_id])
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

exports.product_list = (company_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT product.product_id, product.product_name, product.product_stock, category.category_name, DATE_FORMAT(product.last_update, '%W %M %Y %H:%i:%s') AS last_update
                                     FROM productdb.product AS product
                                     JOIN productdb.category AS category
                                     ON product.category_id = category.category_id
                                     JOIN companydb.company AS company
                                     ON product.company_id = company.company_id
                                     WHERE company.company_id = ? AND product.product_status = 1`, [company_id])
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

exports.product = (product_id, company_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT product_id, product_name, product_stock, product_description, product_rating, product_price, category_id
                                     FROM productdb.product
                                     WHERE product.product_id = ? AND company_id = ?`, [product_id, company_id])
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

exports.product_update = (product_id, product_info) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`UPDATE productdb.product SET ? WHERE product_id = ?`, [product_info, product_id])
                .then((result) => {
                    if (result[0].info.match('Changed: 1')) return (`${product_info.product_name} 資料更新成功`);
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
}

exports.product_delete = (product_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`DELETE FROM productdb.product WHERE product_id = ?`, [product_id])
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
}