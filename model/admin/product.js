const connectionPool = require('../../conf/db');

exports.addNewProductImage = (imagePath) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`INSERT INTO productdb.image (product_id, image_path) VALUES ?`, [imagePath]);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return (`產品圖片添加成功`);
            else throw new Error(`產品图片添加失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err.message}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release()
        })
}

exports.getProductImage = (productId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT image_id, image_path FROM productdb.image WHERE product_id = ?`, [productId]);
        })
        .then(([rows, field]) => {
            return rows;
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err.message}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release()
        })
}

exports.addNewProduct = (productInfo) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`INSERT INTO productdb.product SET ?`, [productInfo]);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return (result);
            else throw new Error(`資料新增失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('資料新增失敗');
        })
        .finally(() => {
            connection.release();
        })
};

exports.getCategoryList = (companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT category.category_id, category.category_name FROM productdb.category AS category
                                     JOIN companydb.company_category AS company_category ON category.category_id = company_category.category_id
                                     WHERE company_category.company_id = ?`, [companyId]);
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('系統暫時無法運行該功能');
        })
        .finally(() => {
            connection.release();
        })
}

exports.getProductList = (companyId, pageInfo) => {
    var connection;
    var pageSize = 20;
    var numberOfRows, numberOfPages;
    var numberPerPage = parseInt(pageSize, 10) || 1;
    var page = parseInt(pageInfo.page, 10) || 1;
    var skip = (page - 1) * numberPerPage;
    var limit = `${skip} , ${numberPerPage}`;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT COUNT(*) AS total_product FROM productdb.product WHERE company_id = ?`, [companyId]);
        })
        .then(([rows, field]) => {
            numberOfRows = rows[0].total_product;
            numberOfPages = Math.ceil(numberOfRows / numberPerPage);
            return connection.query(`SELECT product.product_id, product.product_name, product.product_stock, product.product_status, category.category_id, category.category_name, 
                                     DATE_FORMAT(product.last_update, '%d-%c-%Y %H:%i:%s') AS last_update
                                     FROM productdb.product AS product
                                     JOIN productdb.category AS category ON product.category_id = category.category_id
                                     JOIN companydb.company AS company ON product.company_id = company.company_id
                                     WHERE company.company_id = ? AND product.deleted = 0 LIMIT ${limit}`, [companyId]);
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
            throw new Error('系統暫時無法運行該功能');
        })
        .finally(() => {
            connection.release();
        })
}

exports.getProduct = (productId, companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT product_id, product_name, product_stock, product_description, product_rating, product_price, product_member_price, category_id
                                     FROM productdb.product WHERE product.product_id = ? AND company_id = ?`, [productId, companyId]);
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('系統暫時無法運行該功能');
        })
        .finally(() => {
            connection.release();
        })
}

exports.updateProduct = (productId, productInfo) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`UPDATE productdb.product SET ? WHERE product_id = ?`, [productInfo, productId]);
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (`${productInfo.product_name} 資料更新成功`);
            else return (`資料沒有異動`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('資料更新失敗');
        })
        .finally(() => {
            connection.release();
        })
}

exports.deleteProduct = (productId) => {
    var connection, image_path;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT image.image_path FROM productdb.image AS image
                                     JOIN productdb.product AS product ON image.product_id = product.product_id
                                     WHERE product.product_id = ?`, [productId]);
        })
        .then(([rows, field]) => {
            image_path = rows;
            //return connection.query(`DELETE FROM productdb.product WHERE product_id = ?`, [productId]);
            return connection.query(`UPDATE productdb.product SET deleted = 1, product_status = 0 WHERE product_id = ?`, [productId]);
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (image_path);
            else throw new Error(`資料刪除失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('資料刪除失敗');
        })
        .finally(() => {
            connection.release();
        })
}

exports.deleteProductImage = (imageId) => {
    var connection, image_path;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT image_path FROM productdb.image WHERE image_id = ?`, [imageId]);
        })
        .then(([rows, field]) => {
            image_path = rows;
            return connection.query(`DELETE FROM productdb.image WHERE image_id = ?`, [imageId]);
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return image_path;
            else throw new Error(`資料刪除失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('資料刪除失敗');
        })
        .finally(() => {
            connection.release();
        })
}

exports.unpublishProduct = (productId, companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`UPDATE productdb.product SET product_status = 0 WHERE product_id = ? AND company_id = ?`, [productId, companyId]);
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (`資料更新成功`);
            else return (`資料沒有異動`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(`資料更新失敗`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.publishProduct = (productId, categoryId, companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT company_product_max, (SELECT COUNT(*) FROM productdb.product AS product
                                     JOIN companydb.company AS company ON product.company_id = company.company_id
                                     WHERE product.product_status = 1 AND product.category_id = ? AND product.company_id = ?) AS total_product
                                     FROM companydb.company WHERE company_id = ?`, [categoryId, companyId, companyId]);
        })
        .then(([rows, field]) => {
            if (rows[0].total_product >= rows[0].company_product_max) throw new Error(`該產品屬性已超過可以發佈的產品上限`);
            else return connection.query(`UPDATE productdb.product SET product_status = 1 WHERE product_id = ? AND company_id = ?`, [productId, companyId]);
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (`資料更新成功`);
            else return (`資料沒有異動`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(`資料更新失敗`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.getTotalOfProductImage = (productId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT COUNT(*) AS total_image FROM productdb.image WHERE product_id = ?`, [productId]);
        })
        .then(([rows, field]) => {
            return rows;
        })
        .catch((err) => {
            console.error(err);
            throw new Error(`圖片總數计算失败`);
        })
        .finally(() => {
            connection.release();
        })
}