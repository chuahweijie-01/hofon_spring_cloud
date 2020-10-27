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
            console.error(err);
            throw new Error(err);
        })
        .finally(() => {
            connection.release()
        })
}

exports.getCartId = (userId, companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT cart_id FROM userdb.cart WHERE user_id = ? AND company_id = ?`, [userId, companyId]);
        })
        .then(([rows, field]) => {
            if (rows.length) return rows[0].cart_id;
            else throw new Error('無法獲得購物車資料');
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err);
        })
        .finally(() => {
            connection.release()
        })
}

exports.deleteCartItem = (cartId, orderId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT product_id FROM orderdb.order_product WHERE order_id = ?`, [orderId])
        })
        .then(([rows, field]) => {
            var productArray = [];
            for (var product in rows) {
                productArray.push(rows[product].product_id)
            }
            if (rows.length) return connection.query(`DELETE FROM userdb.cart_product WHERE product_id IN (?) AND cart_id = ?`, [productArray, cartId])
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return ('資料刪除成功');
            else throw new Error('資料刪除失敗');
        })
        .catch((err) => {
            console.error(err);
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
            console.error(err);
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
            console.error(err);
            throw new Error(err);
        })
        .finally(() => {
            connection.release()
        })
}