const connectionPool = require('../../conf/db');

exports.getProductList = (company_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT product.product_id, product.product_name, product.product_price, product.product_member_price, product.product_rating, image.image_path,
                                     category.category_id, category.category_name, product_with_discount.discount_price FROM productdb.product AS product
                                     LEFT JOIN productdb.image AS image ON product.product_id = image.product_id
                                     JOIN productdb.category AS category ON product.category_id = category.category_id
                                     LEFT JOIN productdb.product_with_discount AS product_with_discount ON product.product_id = product_with_discount.product_id
                                     WHERE product.company_id = ? AND product.product_status = 1 GROUP BY product.product_id`, [company_id]);
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('資料選取失敗');
        })
        .finally(() => {
            connection.release();
        })
}

exports.award_details = (product_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT award.award_name, award.award_description FROM productdb.award AS award
                                     JOIN productdb.product_award AS product_award ON product_award.award_id = award.award_id
                                     JOIN productdb.product AS product ON product_award.product_id = product.product_id
                                     WHERE product.product_id = ?`, [product_id])
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(err);
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
            return connection.query(`SELECT advertisement_name, advertisement_image, advertisement_link FROM companydb.advertisement WHERE company_id = ?`, [company_id])
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('資料選取失敗');
        })
        .finally(() => {
            connection.release();
        })
}

exports.getCategoryList = (company_id) => {
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
            console.error(err);
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
                                     product.product_rating, product.product_description, category.category_name
                                     FROM productdb.product AS product
                                     JOIN productdb.category AS category ON product.category_id = category.category_id
                                     LEFT JOIN productdb.product_with_discount AS product_with_discount ON product.product_id = product_with_discount.product_id
                                     WHERE product.company_id = ? AND product.product_id = ? AND product.product_status = 1`, [company_id, product_id])
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('資料新增失敗');
        })
        .finally(() => {
            connection.release();
        })
}

exports.product_image = (product_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT image.image_path FROM productdb.image AS image
                                     LEFT JOIN productdb.product AS product ON image.product_id = product.product_id
                                     WHERE product.product_id = ?`, [product_id])
        })
        .then(([rows, field]) => {
            return rows;
        })
        .catch((err) => {
            console.error(err);
            throw new Error('資料新增失敗');
        })
        .finally(() => {
            connection.release();
        })
}