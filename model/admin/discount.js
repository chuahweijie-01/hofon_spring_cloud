const connectionPool = require('../../conf/db');

exports.addNewDiscount = (discountInfo, productId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`START TRANSACTION`)
        })
        .then((result) => {
            return connection.query(`
            INSERT INTO
                productdb.discount
            SET ?`, [discountInfo]);
        })
        .then((result) => {
            if (result[0].affectedRows === 1) {
                var product = [];
                for (var i = 0; i < productId.length; i++) {
                    product.push([discountInfo.discount_id, productId[i]])
                }
                return connection.query(`
                INSERT INTO
                    productdb.product_discount
                    (discount_id, product_id)
                VALUES ?`, [product]);
            } else throw new Error(`資料新增失敗`);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return connection.query(`COMMIT`);
            else throw new Error(`資料新增失敗`);
        })
        .then((result) => {
            return (`已新增${discountInfo.discount_name}促銷`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err);
        })
        .finally(() => {
            connection.release()
        })
};

exports.getDiscountList = (companyId, pageInfo) => {
    var connection;
    var pageSize = 10;
    var numberOfRows, numberOfPages;
    var numberPerPage = parseInt(pageSize, 10) || 1;
    var page = parseInt(pageInfo.page, 10) || 1;
    var skip = (page - 1) * numberPerPage;
    var limit = `${skip} , ${numberPerPage}`;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                COUNT(*) AS total_discount
            FROM
                productdb.discount
            WHERE
                company_id = ?`, [companyId]);
        })
        .then(([rows, field]) => {
            numberOfRows = rows[0].total_discount;
            numberOfPages = Math.ceil(numberOfRows / numberPerPage);
            return connection.query(`
            SELECT
                discount.discount_id,
                discount.discount_name,
                discount.discount_percent,
                COUNT(*) AS total_product,
                DATE_FORMAT(discount.created_date, '%d-%c-%Y %H:%i:%s') AS created_date
            FROM
                productdb.discount AS discount
            JOIN
                productdb.product_discount AS product_discount
                USING (discount_id)
            JOIN
                productdb.product AS product
                USING (product_id)
            WHERE
                product.company_id = ?
            GROUP BY
                discount.discount_name
            LIMIT ${limit}`, [companyId]);
        })
        .then(([rows, field]) => {
            result = {
                rows: rows,
                pagination: {
                    current: page,
                    numberPerPage: numberPerPage,
                    has_previous: page > 1,
                    previous: page - 1,
                    has_next: page < numberOfPages,
                    next: page + 1,
                    last_page: Math.ceil(numberOfRows / pageSize)
                }
            }
            return (result);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.getProductList = (companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                product.product_id,
                product.product_name,
                discount.discount_name,
                discount.discount_id
            FROM
                productdb.product AS product
            LEFT JOIN
                productdb.product_discount AS product_discount
                USING (product_id)
            LEFT JOIN
                productdb.discount AS discount
                USING (discount_id)
            WHERE
                product.company_id = ?
                AND product.product_status = 1
            ORDER BY
                discount.discount_id`, [companyId]);
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.getDiscount = (discountId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                discount.discount_id,
                discount.discount_name,
                discount.discount_percent,
                product.product_id
            FROM
                productdb.discount AS discount
            JOIN
                productdb.product_discount AS product_discount
                USING (discount_id)
            JOIN
                productdb.product AS product
                USING (product_id)
            WHERE
                discount.discount_id = ?`, [discountId]);
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.updateDiscount = (discountInfo, discountId, product_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            DELETE FROM
                productdb.product_discount
            WHERE
                discount_id = ?`, [discountId]);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) {
                product = [];
                for (var i = 0; i < product_id.length; i++) {
                    product.push([discountId, product_id[i]])
                }
                return connection.query(`
                INSERT INTO
                    productdb.product_discount
                    (discount_id, product_id)
                VALUES ?`, [product]);
            } else throw new Error(`資料更新失敗`);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return connection.query(`
            UPDATE
                productdb.discount
            SET ?
            WHERE
                discount_id = ?`, [discountInfo, discountId]);
            else throw new Error(`資料更新失敗`);
        })
        .then((result) => {
            if (result[0].affectedRows == 1) return (`資料更新成功`);
            else throw new Error(`資料更新失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err);
        })
        .finally(() => {
            connection.release();
        })
}

exports.deleteDiscount = (discountId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            DELETE FROM
                productdb.discount
            WHERE
                discount_id = ?`, [discountId]);
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (`資料刪除成功`);
            else throw new Error(`資料刪除失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
}