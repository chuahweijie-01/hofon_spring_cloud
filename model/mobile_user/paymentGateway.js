const connection = require('../../conf/db');
const connectionPool = require('../../conf/db');

exports.generateOrder = (order_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT product_name, order_final_price FROM orderdb.order_full_information WHERE order_id = ?`, [order_id])
        })
        .then(([rows, field]) => {
            if (rows.length) return rows;
            else throw new Error(`訂單生成失敗`)
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err);
        })
        .finally(() => {
            connection.release()
        })
}

exports.merchantTradeNoUpdate = (orderId, paymentDate, tradeDate, tradeNo) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`UPDATE orderdb.order SET payment_date = ?, trade_date = ?, trade_number = ? WHERE order_id = ?`,
                                    [paymentDate, tradeDate, tradeNo, orderId])
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return connection.query(`SELECT product_id, quantity FROM orderdb.order_product WHERE order_id = ?`, [orderId]);
            else throw new Error(`該訂單交易已是完成狀態`)
        })
        .then(([rows, field]) => {
            for (var i = 0; i < rows.length; i++) {
                connection.query(`UPDATE productdb.product SET product_stock = GREATEST(product_stock - ?, 0) WHERE product_id = ?`, [rows[i].quantity, rows[i].product_id])
                    .then((result) => {
                        // Update continue ...
                    })
            }
            return (`訂單更新完成`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err);
        })
        .finally(() => {
            connection.release()
        })
}

exports.getCompanyEmail = (compnany_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT company_email FROM companydb.company WHERE company_id = ?`, [compnany_id])
        })
        .then(([rows, field]) => {
            return rows;
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err);
        })
        .finally(() => {
            connection.release()
        })
}