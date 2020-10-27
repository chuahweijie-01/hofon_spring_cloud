const connectionPool = require('../../conf/db');

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