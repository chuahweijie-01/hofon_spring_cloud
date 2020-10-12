const connectionPool = require('../../conf/db');

exports.create_order = (order_info, product_info) => {
    var connection, order_id;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`INSERT INTO orderdb.order SET ?`, [order_info]);
        })
        .then((result) => {
            order_id = result[0].insertId;
            for (var i = 0; i < product_info.length; i++) {
                connection.query(`INSERT INTO orderdb.order_product(order_id, product_id, quantity, nett_price, discount_price, total_price)
                                  VALUES (?, ?, ?, (SELECT product_member_price FROM productdb.product WHERE product_id = ?),
                                  IFNULL ((SELECT discount_price FROM productdb.product_with_discount WHERE product_id = ?), nett_price), (discount_price * ?));`
                    , [result[0].insertId, product_info[i].product_id, product_info[i].quantity, product_info[i].product_id, product_info[i].product_id, product_info[i].quantity])
                    .then((result) => {
                        //if (result[0].affectedRows >= 1) console.log(`Turn ${i}`)
                        //else console.log(`Something happened`);
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
            return connection.query(`SELECT order_id, order_total_item, order_final_price, order_status, DATE_FORMAT(created_date, '%D %M %Y %H:%i:%s') AS created_date
                                     FROM orderdb.order WHERE company_id = ? AND user_id = ?`, [company_id, user_id])
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

exports.order_display = (order_id, company_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT * FROM orderdb.order_full_information WHERE order_id = ? AND company_id = ? GROUP BY product_id`, [order_id, company_id])
        })
        .then(([rows, field]) => {
            return rows;
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
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

exports.update_order_address = (address_id) => {
    var connection;
}