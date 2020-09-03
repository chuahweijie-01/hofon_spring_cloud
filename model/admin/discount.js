const connectionPool = require('../../conf/db');

exports.discount_create = (discount_info, product_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`INSERT INTO productdb.discount SET ?`, [discount_info]);
        })
        .then((result) => {
            if (result[0].affectedRows === 1) {
                product = [];
                for (var i = 0; i < product_id.length; i++) {
                    product.push([result[0].insertId, product_id[i]])
                }
                return connection.query(`INSERT INTO productdb.product_discount(discount_id, product_id) VALUES ?`, [product])
            } else throw new Error(`資料新增失敗`);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return (`已新增${discount_info.discount_name}促銷`);
            else throw new Error(`資料新增失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err);
        })
        .finally(() => {
            connection.release()
        })
};

exports.discount_display_list = (company_id, page_info) => {
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
            return connection.query(`SELECT COUNT(*) AS total_discount FROM productdb.discount WHERE company_id = ?`, [company_id])
        })
        .then(([rows, field]) => {
            number_of_rows = rows[0].total_discount;
            number_of_pages = Math.ceil(number_of_rows / number_per_page);
            return connection.query(`SELECT discount.discount_id, discount.discount_name, discount.discount_percent, COUNT(*) AS total_product,
                                     DATE_FORMAT(discount.created_date, '%D %M %Y %H:%i:%s') AS created_date
                                     FROM productdb.discount AS discount
                                     JOIN productdb.product_discount AS product_discount ON discount.discount_id = product_discount.discount_id
                                     JOIN productdb.product AS product ON product_discount.product_id = product.product_id
                                     WHERE product.company_id = ? GROUP BY discount.discount_name LIMIT ${limit}`, [company_id]);
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
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.product_list = (company_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT product.product_id, product.product_name, discount.discount_name, discount.discount_id
                                     FROM productdb.product AS product
                                     LEFT JOIN productdb.product_discount AS product_discount ON product.product_id = product_discount.product_id
                                     LEFT JOIN productdb.discount AS discount ON product_discount.discount_id = discount.discount_id
                                     WHERE product.company_id = ? AND product.product_status = 1`, [company_id])
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.discount_display = (discount_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT discount.discount_id, discount.discount_name, discount.discount_percent, product.product_id
                                     FROM productdb.discount AS discount
                                     JOIN productdb.product_discount AS product_discount ON discount.discount_id = product_discount.discount_id
                                     JOIN productdb.product AS product ON product_discount.product_id = product.product_id
                                     WHERE discount.discount_id = ?`, [discount_id])
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.discount_update = (discount_info, discount_id, product_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`DELETE FROM productdb.product_discount WHERE discount_id = ?`, [discount_id])
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) {
                product = [];
                for (var i = 0; i < product_id.length; i++) {
                    product.push([discount_id, product_id[i]])
                }
                return connection.query(`INSERT INTO productdb.product_discount(discount_id, product_id) VALUES ?`, [product])
            } else throw new Error(`資料更新失敗`);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return connection.query(`UPDATE productdb.discount SET ? WHERE discount_id = ?`, [discount_info, discount_id]);
            else throw new Error(`資料更新失敗`);
        })
        .then((result) => {
            if (result[0].affectedRows == 1) return (`資料更新成功`);
            else throw new Error(`資料更新失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err);
        })
        .finally(() => {
            connection.release();
        })
}

exports.discount_delete = (discount_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`DELETE FROM productdb.discount WHERE discount_id = ?`, [discount_id]);
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (`資料刪除成功`);
            else throw new Error(`資料刪除失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
}