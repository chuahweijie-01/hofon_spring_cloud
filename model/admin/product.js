const { response } = require('express');
const connectionPool = require('../../conf/db');

exports.insert_product_image = (image_path) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`INSERT INTO productdb.image (product_id, image_path) VALUES ?`, [image_path])
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return (`產品圖片添加成功`);
            else throw new Error(`產品图片添加失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err.message}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release()
        })
}

exports.product_image = (product_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT image_id, image_path FROM productdb.image WHERE product_id = ?`, [product_id])
        })
        .then(([rows, field]) => {
            return rows;
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err.message}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release()
        })
}

exports.product_create = (product_info) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`INSERT INTO productdb.product SET ?`, [product_info])
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return (result[0].insertId);
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

exports.category_list = (company_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT category.category_id, category.category_name FROM productdb.category AS category
                                     JOIN companydb.company_category AS company_category ON category.category_id = company_category.category_id
                                     WHERE company_category.company_id = ?`, [company_id])
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

exports.product_list = (company_id, page_info) => {
    var connection;
    var page_size = 10;
    var number_of_rows, number_of_pages;
    var number_per_page = parseInt(page_size, 10) || 1;
    var page = parseInt(page_info.page, 10) || 1;
    var skip = (page - 1) * number_per_page;
    var limit = `${skip} , ${number_per_page}`;

    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT COUNT(*) AS total_product FROM productdb.product WHERE company_id = ?`, [company_id])
        })
        .then(([rows, field]) => {
            number_of_rows = rows[0].total_product;
            number_of_pages = Math.ceil(number_of_rows / number_per_page);
            return connection.query(`SELECT product.product_id, product.product_name, product.product_stock, product.product_status, category.category_id, category.category_name, 
                                     DATE_FORMAT(product.last_update, '%d-%c-%Y %H:%i:%s') AS last_update
                                     FROM productdb.product AS product
                                     JOIN productdb.category AS category ON product.category_id = category.category_id
                                     JOIN companydb.company AS company ON product.company_id = company.company_id
                                     WHERE company.company_id = ? LIMIT ${limit}`, [company_id])
        })
        .then(([rows, field]) => {
            result = {
                rows: rows,
                pagination: {
                    current: page,
                    number_per_page: number_per_page,
                    has_previous: page > 1,
                    previous: page - 1,
                    has_next: page < number_of_pages,
                    next: page + 1,
                    last_page: Math.ceil(number_of_rows / page_size)
                }
            }
            return (result);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('系統暫時無法運行該功能');
        })
        .finally(() => {
            connection.release();
        })
}

exports.product = (product_id, company_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT product_id, product_name, product_stock, product_description, product_rating, product_price, product_member_price, category_id
                                     FROM productdb.product WHERE product.product_id = ? AND company_id = ?`, [product_id, company_id])
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
    var connection, image_path;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT image.image_path FROM productdb.image AS image
                                     JOIN productdb.product AS product ON image.product_id = product.product_id
                                     WHERE product.product_id = ?`, [product_id])
        })
        .then(([rows, field]) => {
            image_path = rows;
            return connection.query(`DELETE FROM productdb.product WHERE product_id = ?`, [product_id])
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (image_path);
            else throw new Error(`資料刪除失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料刪除失敗');
        })
        .finally(() => {
            connection.release();
        })
}

exports.image_delete = (image_id) => {
    var connection, image_path;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT image_path FROM productdb.image WHERE image_id = ?`, [image_id])
        })
        .then(([rows, field]) => {
            image_path = rows;
            return connection.query(`DELETE FROM productdb.image WHERE image_id = ?`, [image_id])
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return image_path;
            else throw new Error(`資料刪除失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料刪除失敗');
        })
        .finally(() => {
            connection.release();
        })
}

exports.product_unpublish = (product_id, company_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`UPDATE productdb.product SET product_status = 0 WHERE product_id = ? AND company_id = ?`, [product_id, company_id])
                .then((result) => {
                    if (result[0].info.match('Changed: 1')) return (`資料更新成功`);
                    else return (`資料沒有異動`);
                })
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`資料更新失敗`);
        })
}

exports.product_publish = (product_id, category_id, company_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT company_product_max, (SELECT COUNT(*) FROM productdb.product AS product
                                     JOIN companydb.company AS company ON product.company_id = company.company_id
                                     WHERE product.product_status = 1 AND product.category_id = ? AND product.company_id = ?) AS total_product
                                     FROM companydb.company WHERE company_id = ?`, [category_id, company_id, company_id])
                .then(([rows, field]) => {
                    if (rows[0].total_product >= rows[0].company_product_max) throw new Error(`該產品屬性已超過可以發佈的產品上限`);
                    else return connection.query(`UPDATE productdb.product SET product_status = 1 WHERE product_id = ? AND company_id = ?`, [product_id, company_id])
                })
                .then((result) => {
                    if (result[0].info.match('Changed: 1')) return (`資料更新成功`);
                    else return (`資料沒有異動`);
                })
                .finally(() => {
                    connection.release();
                })
        }, err => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`資料更新失敗`);
        })
}

exports.product_image_total = (product_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT COUNT(*) AS total_image FROM productdb.image WHERE product_id = ?`, [product_id])
        })
        .then(([rows, field]) => {
            return rows;
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`圖片總數计算失败`);
        })
        .finally(() => {
            connection.release();
        })
}