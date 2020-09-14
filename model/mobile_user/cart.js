const connectionPool = require('../../conf/db');

exports.cart_products = (user_id, company_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT product.product_id, product.product_name, product.product_price, product.product_member_price, cart_product.quantity,
                                     SUM(product.product_member_price * cart_product.quantity) AS total_price, product_with_discount.discount_price,
                                     SUM(product_with_discount.discount_price * cart_product.quantity) AS total_discount_price
                                     FROM userdb.cart AS cart
                                     JOIN userdb.cart_product AS cart_product ON cart.cart_id = cart_product.cart_id
                                     JOIN productdb.product AS product ON cart_product.product_id = product.product_id
                                     LEFT JOIN productdb.product_with_discount AS product_with_discount ON product.product_id = product_with_discount.product_id
                                     JOIN companydb.company AS company ON product.company_id = company.company_id
                                     WHERE cart.user_id = ? AND company.company_id = ? GROUP BY product.product_id`, [user_id, company_id]);
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`無法使用購物車功能`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.add_to_cart = (user_id, company_id, product_id, quantity) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`INSERT INTO userdb.cart (user_id, company_id) VALUES (?,?) ON DUPLICATE KEY UPDATE user_id = user_id `, [user_id, company_id]);
        })
        .then(() => {
            return connection.query(`INSERT INTO userdb.cart_product(cart_id, product_id, quantity)
                                     VALUES ((SELECT cart_id FROM userdb.cart WHERE user_id = ?), ?, ?)
                                     ON DUPLICATE KEY UPDATE quantity = ? `, [user_id, product_id, quantity, quantity]);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return (`產品已添加至購物車`);
            else throw new Error(`無法添加至購物車`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err.message}`);
            throw new Error(`無法添加至購物車`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.remove_from_cart = (product_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`DELETE FROM userdb.cart_product WHERE product_id = ? `, [product_id]);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return (`產品已從購物車移除`);
            else throw new Error(`無法從購物車移除`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`無法從購物車移除`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.delete_cart = (user_id, company_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`DELETE FROM userdb.cart WHERE user_id = ? AND company_id = ? `, [user_id, company_id]);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return (`已移除購物車`);
            else throw new Error(`無法移除購物車`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`無法移除購物車`);
        })
        .finally(() => {
            connection.release();
        })
}