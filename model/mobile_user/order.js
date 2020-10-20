const connectionPool = require('../../conf/db');

exports.create_order = (order_info, product_info) => {
    var connection, order_id;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`INSERT INTO orderdb.order SET ?`, [order_info]);
        })
        .then((result) => {
            order_id = order_info.order_id;
            for (var i = 0; i < product_info.length; i++) {
                connection.query(`INSERT INTO orderdb.order_product(order_id, product_id, quantity, nett_price, discount_price, total_price)
                                  SELECT ?,?,?, product.product_member_price, IFNULL(product_with_discount.discount_price, product.product_member_price), IFNULL(product_with_discount.discount_price * ?, product.product_member_price * ?)
                                  FROM productdb.product AS product JOIN productdb.product_with_discount AS product_with_discount ON product_with_discount.product_id = product.product_id
                                  WHERE product.product_id = ?`, [order_id, product_info[i].product_id, product_info[i].quantity, product_info[i].quantity, product_info[i].quantity, product_info[i].product_id])
                    .then((result) => {
                        // Update continue ...
                    })
                    .catch((err) => {
                        console.error(`${err}`);
                        throw new Error(err);
                    })
            }
            if (result[0].affectedRows >= 1) return (order_id);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err);
        })
        .finally(() => {
            connection.release()
        })
}

exports.order_list = (company_id, user_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT order_id, order_total_item, order_final_price, order_status, DATE_FORMAT(trade_date, '%D %c %Y %H:%i:%s') AS trade_date
                                     FROM orderdb.order WHERE company_id = ? AND user_id = ?  AND (order_status = 0 OR order_status = 1)`, [company_id, user_id])
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err.message}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release()
        })
}

exports.order_display = (order_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT * FROM orderdb.order_full_information WHERE order_id = ? GROUP BY product_id`, [order_id])
        })
        .then(([rows, field]) => {
            if (rows.length) return rows;
            else throw new Error(`該訂單已從資料庫中移除`)
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
}

exports.order_review = (order_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT address_detail, city_name, country_name_chinese, order_total_price, order_tax, order_final_price,
                                     product_name, image_path, discount_price, quantity, total_price
                                     FROM orderdb.order_full_information WHERE order_id = ?`, [order_id])
        })
        .then(([rows, length]) => {
            if (rows.length) return rows;
            else throw new Error(`訂單生成失敗`)
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release()
        })
}

exports.delete_order = (order_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`DELETE FROM orderdb.order WHERE order_id = ?`, [order_id])
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (`訂單已移除`);
            else throw new Error(`訂單移除失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release()
        })
}

exports.update_order_address = (order_address, user_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT * FROM userdb.address AS address
                                     JOIN userdb.user_address AS user_address ON address.address_id = user_address.address_id
                                     JOIN userdb.user AS user ON user_address.user_id = user.user_id WHERE user.user_id = ? AND address.address_id = ?`, [user_id, order_address.address_id])
        })
        .then(([rows, field]) => {
            if (rows.length) return connection.query(`INSERT INTO orderdb.order_address SET ? ON DUPLICATE KEY UPDATE address_Id = ?`, [order_address, order_address.address_id])
            else throw new Error(`訂單地址添加失敗`);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return (`訂單地址已添加`)
            else throw new Error(`訂單地址添加失敗`)
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release()
        })
}