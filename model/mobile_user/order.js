const connectionPool = require('../../conf/db');

exports.create_order = (order_info, product_info) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`INSERT INTO orderdb.order SET ?`, [order_info]);
        })
        .then((result) => {
            for (var i = 0; i < product_info.length; i++) {
                connection.query(`INSERT INTO orderdb.order_product(order_id, product_id, quantity, nett_price, discount_price, total_price)
                                  VALUES (?, ?, ?, (SELECT product_member_price FROM productdb.product WHERE product_id = ?),
                                  IFNULL (nett_price , (SELECT discount_price FROM productdb.product_with_discount WHERE product_id = ?)), (discount_price * ?));`
                    , [result[0].insertId, product_info[i].product_id, product_info[i].quantity, product_info[i].product_id, product_info[i].product_id, product_info[i].quantity])
                    .then((result) => {
                        //if (result[0].affectedRows >= 1) console.log(`Turn ${i}`)
                        //else console.log(`Something happened`);
                    })
            }
            if (result[0].affectedRows >= 1) return (`訂單已上載至所屬公司`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err);
        })
        .finally(() => {
            connection.release()
        })
}