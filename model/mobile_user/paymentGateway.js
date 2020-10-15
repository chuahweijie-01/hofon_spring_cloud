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