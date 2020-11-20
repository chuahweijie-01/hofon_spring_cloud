const connectionPool = require('../../conf/db');

exports.addNewOrder = (orderInfo, product_info) => {
    var connection;
    var orderId = orderInfo.order_id;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            INSERT INTO
                orderdb.order
            SET ?`, [orderInfo]);
        })
        .then((result) => {
            for (var i = 0; i < product_info.length; i++) {
                connection.query(`
                INSERT INTO 
                    orderdb.order_product
                    (order_id, product_id, quantity, nett_price, discount_price, total_price)
                        SELECT 
                            ?,?,?,
                            product.product_member_price,
                            product_with_discount.discount_price,
                            product_with_discount.discount_price * ?
                        FROM
                            productdb.product AS product
                        JOIN
                            productdb.product_with_discount AS product_with_discount
                            ON product_with_discount.product_id = product.product_id
                        WHERE
                            product.product_id = ?`, [orderId, product_info[i].product_id, product_info[i].quantity, product_info[i].quantity, product_info[i].product_id])
                    .then((result) => {
                        // Update continue ...
                    })
                    .catch((err) => {
                        console.error(`${err}`);
                        throw new Error(err);
                    })
            }
            if (result[0].affectedRows >= 1) return (orderId);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err);
        })
        .finally(() => {
            connection.release()
        })
}

exports.getOrderList = (companyId, userId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                order_id,
                order_total_item,
                order_final_price,
                order_status,
                DATE_FORMAT(trade_date, '%d-%c-%Y %H:%i:%s') AS trade_date
            FROM
                orderdb.order
            WHERE
                company_id = ?
                AND user_id = ? 
                AND (order_status = 0 OR order_status = 1)`, [companyId, userId])
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR ORDER : ${err.message}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release()
        })
}

exports.getOrder = (orderId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT * FROM orderdb.order_full_information WHERE order_id = ? GROUP BY product_id`, [orderId])
        })
        .then(([rows, field]) => {
            if (rows.length) return rows;
            else throw new Error(`該訂單已從資料庫中移除`)
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
}

exports.getOrderReview = (orderId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT address_detail, city_name, country_name_chinese, order_total_price, order_tax, order_final_price, order_zone_charge,
                                     product_name, image_path, discount_price, quantity, total_price
                                     FROM orderdb.order_full_information WHERE order_id = ?`, [orderId])
        })
        .then(([rows, length]) => {
            if (rows.length) return rows;
            else throw new Error(`訂單生成失敗`)
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release()
        })
}

exports.deleteOrder = (orderId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`DELETE FROM orderdb.order WHERE order_id = ?`, [orderId])
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (`訂單已移除`);
            else throw new Error(`訂單移除失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release()
        })
}

exports.updateOrderAddress = (orderAddress, userId, companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`START TRANSACTION`);
        })
        .then((result) => {
            return connection.query(`SELECT * FROM userdb.address AS address
                                     JOIN userdb.user_address AS user_address ON address.address_id = user_address.address_id
                                     JOIN userdb.user AS user ON user_address.user_id = user.user_id WHERE user.user_id = ? AND address.address_id = ?`, [userId, orderAddress.address_id])
        })
        .then(([rows, field]) => {
            if (rows.length) return connection.query(`INSERT INTO orderdb.order_address SET ? ON DUPLICATE KEY UPDATE address_Id = ?`, [orderAddress, orderAddress.address_id])
            else throw new Error(`訂單地址添加失敗1`);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1)
                return connection.query(`SELECT zone.zone_charge FROM orderdb.order AS orderr
                                         JOIN orderdb.order_address AS order_address ON orderr.order_id = order_address.order_id
                                         JOIN userdb.address AS address ON order_address.address_id = address.address_id
                                         JOIN userdb.city AS city ON address.city_id = city.city_id
                                         JOIN companydb.zone_city AS zone_city ON city.city_id = zone_city.city_id
                                         JOIN companydb.zone AS zone ON zone_city.zone_id = zone.zone_id WHERE orderr.order_id = ? and zone.company_id = ?`, [orderAddress.order_id, companyId])
            else throw new Error(`訂單地址添加失敗2`)
        })
        .then(([rows, field]) => {
            var zoneCharge;
            if (rows.length) zoneCharge = rows[0].zone_charge;
            else zoneCharge = 0;
            return connection.query(`UPDATE orderdb.order SET order_zone_charge = ?, order_final_price = order_final_price + order_zone_charge WHERE order_id = ?`,
                [zoneCharge, orderAddress.order_id])
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return connection.query(`COMMIT`);
            else throw new Error(`訂單地址添加失敗3`)
        })
        .then((result) => {
            return (`訂單更新完成`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release()
        })
}