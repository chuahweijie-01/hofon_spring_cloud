const connectionPool = require('../../conf/db');

exports.product_list = (company_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT product.product_id, product.product_name, product.product_price, product.product_member_price, product.product_rating, 
                                     category.category_id, category.category_name, product_with_discount.discount_price
                                     FROM productdb.product AS product
                                     JOIN productdb.category AS category ON product.category_id = category.category_id
                                     LEFT JOIN productdb.product_with_discount AS product_with_discount ON product.product_id = product_with_discount.product_id
                                     WHERE product.company_id = ? AND product.product_status = 1`, [company_id]);
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料選取失敗');
        })
        .finally(() => {
            connection.release();
        })
}

exports.ads_list = (company_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT advertisement_name, advertisement_link FROM companydb.advertisement WHERE company_id = ?`, [company_id])
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料新增失敗');
        })
        .finally(() => {
            connection.release();
        })
}

exports.category_list = (company_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT category.category_id, category.category_name
                                     FROM productdb.category AS category
                                     JOIN companydb.company_category AS company_category ON category.category_id = company_category.category_id
                                     JOIN companydb.company AS company ON company_category.company_id = company.company_id
                                     WHERE company.company_id = ?`, [company_id])
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料新增失敗');
        })
        .finally(() => {
            connection.release();
        })
}

exports.product_display = (product_id, company_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT product.product_id, product.product_name, product.product_price, product.product_member_price, product_with_discount.discount_price,
                                     product.product_rating, product.product_description, award.award_name, award.award_description, category.category_name
                                     FROM productdb.product AS product
                                     JOIN productdb.category AS category ON product.category_id = category.category_id
                                     LEFT JOIN productdb.product_award AS product_award ON product.product_id = product_award.product_id
                                     LEFT JOIN productdb.award AS award ON product_award.award_id = award.award_id
                                     LEFT JOIN productdb.product_with_discount AS product_with_discount ON product.product_id = product_with_discount.product_id
                                     WHERE product.company_id = ? AND product.product_id = ? AND product.product_status = 1`, [company_id, product_id])
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料新增失敗');
        })
        .finally(() => {
            connection.release();
        })
}