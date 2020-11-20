const connectionPool = require('../../conf/db');

exports.getCartProductList = (userId, companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                cart.cart_id,
                image.image_path,
                product.product_id,
                product.product_name,
                product.product_price,
                cart_product.quantity,
                product.product_member_price,
                product_with_discount.discount_price,
                SUM(product.product_member_price * cart_product.quantity) AS total_price,
                SUM(product_with_discount.discount_price * cart_product.quantity) AS total_discount_price
            FROM
                userdb.cart AS cart
            JOIN
                userdb.cart_product AS cart_product
                ON cart.cart_id = cart_product.cart_id
            JOIN
                productdb.product AS product
                ON cart_product.product_id = product.product_id
            JOIN
                productdb.image AS image
                ON product.product_id = image.product_id
            LEFT JOIN
                productdb.product_with_discount AS product_with_discount
                ON product.product_id = product_with_discount.product_id
            JOIN
                companydb.company AS company
                ON product.company_id = company.company_id
            WHERE
                cart.user_id = ?
                AND company.company_id = ?
            GROUP BY
                product.product_id`, [userId, companyId]);
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(`無法使用購物車功能`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.addToCart = (newCartId, userId, companyId, productId, quantity) => {
    var connection;
    var cartId;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`START TRANSACTION`);
        })
        .then((result) => {
            return connection.query(`
            SELECT
                cart_id
            FROM
                userdb.cart
            WHERE
                user_id = ?
                AND company_id = ?`, [userId, companyId]);
        })
        .then(([rows, field]) => {
            if (rows.length) cartId = rows[0].cart_id;
            else cartId = newCartId;
            return connection.query(`
            INSERT INTO
                userdb.cart
                (cart_id, user_id, company_id)
            VALUES
                (?,?,?)
            ON DUPLICATE KEY
                UPDATE
                    user_id = user_id `, [cartId, userId, companyId]);
        })
        .then((result) => {
            return connection.query(`
            SELECT *
            FROM
                userdb.cart_product
            WHERE
                cart_Id = ?
                AND product_id = ?`, [cartId, productId]);
        })
        .then(([rows, field]) => {
            if (!rows.length) {
                return connection.query(`
                INSERT INTO
                    userdb.cart_product
                    (cart_id, product_id, quantity)
                VALUES
                    (?,?,?)`, [cartId, productId, quantity]);
            } else {
                return connection.query(`
                UPDATE
                    userdb.cart_product
                SET
                    quantity = ?
                WHERE
                    cart_id = ?
                    AND product_id = ?`, [quantity, cartId, productId]);
            }
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return connection.query(`COMMIT`);
            else throw new Error(`無法添加至購物車`);
        })
        .then((result) => {
            return (`產品已添加至購物車`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR CART: ${err.message}`);
            throw new Error(err);
        })
        .finally(() => {
            connection.release();
        })
}

exports.deleteFromCart = (cartId, productId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            DELETE FROM
                userdb.cart_product
            WHERE
                cart_id = ?
                AND product_id = ?`, [cartId, productId]);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return (`產品已從購物車移除`);
            else throw new Error(`無法從購物車移除`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(`無法從購物車移除`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.deleteCart = (userId, companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            DELETE FROM
                userdb.cart
            WHERE
                user_id = ?
                AND company_id = ? `, [userId, companyId]);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return (`已移除購物車`);
            else throw new Error(`無法移除購物車`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(`無法移除購物車`);
        })
        .finally(() => {
            connection.release();
        })
}