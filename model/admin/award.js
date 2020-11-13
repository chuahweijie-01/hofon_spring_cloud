const connectionPool = require('../../conf/db');

exports.addNewAward = (awardInfo, productId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`INSERT INTO productdb.award SET ? `, [awardInfo]);
        })
        .then((result) => {
            if (result[0].affectedRows === 1) {
                var product = [];
                for (var i = 0; i < productId.length; i++) {
                    product.push([productId[i], awardInfo.award_id])
                }
                return connection.query(`INSERT INTO productdb.product_award (product_id, award_id) VALUES ?`, [product]);
            }
            else throw new Error(`資料新增失敗`);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return (`${awardInfo.award_name} 新增成功`);
            else throw new Error(`資料新增失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
};

exports.getAward = (awardId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT award.award_id, award.award_name, award.award_description, product_award.product_id, product.product_name
                                     FROM productdb.award AS award
                                     JOIN productdb.product_award AS product_award ON award.award_id = product_award.award_id
                                     JOIN productdb.product AS product ON product_award.product_id = product.product_id
                                     WHERE award.award_id = ?`, [awardId]);
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

exports.getAwardList = (companyId, pageInfo) => {
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
            return connection.query(`SELECT COUNT(*) AS total_award FROM productdb.award WHERE company_id = ?`, companyId);
        })
        .then(([rows, field]) => {
            numberOfRows = rows[0].total_product;
            numberOfPages = Math.ceil(numberOfRows / numberPerPage);
            return connection.query(`SELECT COUNT(*) AS total_award, award.award_id, award.award_name,
                                     DATE_FORMAT(award.last_update, '%d-%c-%Y %H:%i:%s') AS last_update
                                     FROM productdb.award AS award
                                     LEFT JOIN productdb.product_award AS product_award ON award.award_id = product_award.award_id
                                     LEFT JOIN productdb.product AS product ON product_award.product_id = product.product_id
                                     WHERE product.company_id = ? GROUP BY award.award_name LIMIT ${limit}`, [companyId]);
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
            throw new Error('資料新增失敗');
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
            return connection.query(`SELECT product_id, product_name FROM productdb.product WHERE company_id = ?`, [companyId]);
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

exports.updateAward = (awardId, awardInfo, productId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`DELETE FROM productdb.product_award WHERE award_id = ?`, [awardId]);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) {
                var product = [];
                for (var i = 0; i < productId.length; i++) {
                    product.push([productId[i], award_id])
                }
                return connection.query(`INSERT INTO productdb.product_award (product_id, award_id) VALUES ?`, [product]);
            } else throw new Error(`資料更新失敗`);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return connection.query(`UPDATE productdb.award SET ? WHERE award_id = ?`, [awardInfo, awardId]);
            else throw new Error(`資料更新失敗`);
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (`${awardInfo.award_name} 資料更新成功`);
            else return (`關聯產品刷新成功`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
};

exports.deleteAward = (awardId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`DELETE FROM productdb.award WHERE award_id = ?`, [awardId]);
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (`資料刪除成功`);
            else throw new Error(`資料刪除失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('資料刪除失敗');
        })
        .finally(() => {
            connection.release();
        })
};