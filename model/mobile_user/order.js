const connectionPool = require('../../conf/db');

exports.create_order = (order_info, product_info) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`INSERT INTO orderdb.order SET ?`, [order_info]);
        })
        .then((result) => {
            //if (result[0].affectedRows >= 1) return connection.query(`INSERT INTO orderdb.order_product`);
            if (result[0].affectedRows >= 1) return (`SUCCESS`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err);
        })
        .finally(() => {
            connection.release()
        })
}