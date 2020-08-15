const connectionPool = require('../../conf/db');

exports.award_create = (award_info, product_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`INSERT INTO productdb.award SET ? `, [award_info])
                .then((result) => {
                    if (result[0].affectedRows === 1) {
                        product = [];
                        for (var i = 0; i < product_id.length; i++) {
                            product.push([product_id[i], result[0].insertId])
                        }
                        return connection.query(`INSERT INTO productdb.product_award (product_id, award_id) VALUES ?`, [product]);
                    }
                    else throw new Error(`資料新增失敗`);
                })
                .then((result) => {
                    if (result[0].affectedRows >= 1) return (`${award_info.award_name} 新增成功`);
                    else throw new Error(`資料新增失敗`);
                })
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料新增失敗');
        })
};

exports.award_display = (award_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT award.award_id, award.award_name, award.award_description, product_award.product_id, product.product_name
                                     FROM productdb.award AS award
                                     JOIN productdb.product_award AS product_award
                                     ON award.award_id = product_award.award_id
                                     JOIN productdb.product AS product
                                     ON product_award.product_id = product.product_id
                                     WHERE award.award_id = ?`, [award_id])
                .then(([rows, field]) => {
                    return (rows);
                })
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('系統暫時無法運行該功能');
        })
}

exports.award_display_list = (company_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT COUNT(*) AS total_award, award.award_id, award.award_name,
                                     DATE_FORMAT(award.last_update, '%W %M %Y %H:%i:%s') AS last_update
                                     FROM productdb.award AS award
                                     LEFT JOIN productdb.product_award AS product_award
                                     ON award.award_id = product_award.award_id
                                     LEFT JOIN productdb.product AS product
                                     ON product_award.product_id = product.product_id
                                     WHERE product.company_id = ?
                                     GROUP BY award.award_name`, [company_id])
                .then(([rows, field]) => {
                    return (rows);
                })
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料新增失敗');
        })
}

exports.product_list = (company_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT product_id, product_name FROM productdb.product WHERE company_id = ? AND product_status = 1`, [company_id])
                .then(([rows, field]) => {
                    return (rows);
                })
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('系統暫時無法運行該功能');
        })
}

exports.award_update = (award_id, award_info, product_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`DELETE FROM productdb.product_award WHERE award_id = ?`, [award_id])
                .then((result) => {
                    if (result[0].affectedRows >= 1) {
                        product = [];
                        console.log(product_id)
                        console.log(result)
                        for (var i = 0; i < product_id.length; i++) {
                            product.push([product_id[i], award_id])
                        }
                        console.log(product)
                        return connection.query(`INSERT INTO productdb.product_award (product_id, award_id) VALUES ?`, [product]);
                    } else throw new Error(`資料更新失敗`);
                })
                .then((result) => {
                    if (result[0].affectedRows >= 1) return connection.query(`UPDATE productdb.award SET ? WHERE award_id = ?`, [award_info, award_id]);
                    else throw new Error(`資料更新失敗`);
                })
                .then((result) => {
                    if (result[0].info.match('Changed: 1')) return (`${award_info.award_name} 資料更新成功`);
                    else return (`關聯產品刷新成功`);
                })
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料更新失敗');
        })
};

exports.award_delete = (award_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`DELETE FROM productdb.award WHERE award_id = ?`, [award_id])
                .then((result) => {
                    if (result[0].affectedRows === 1) return (`資料刪除成功`);
                    else throw new Error(`資料刪除失敗`);
                })
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料刪除失敗');
        })
};