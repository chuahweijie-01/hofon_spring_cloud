const connectionPool = require('../../conf/db');

exports.album_display_list = (company_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT product.category_id, product.category_name
                                     FROM productdb.category AS product
                                     JOIN companydb.company_category AS company_category
                                     ON product.category_id = company_category.category_id
                                     WHERE company_category.company_id = ?`, [company_id])
                .then(([rows, field]) => {
                    return (rows);
                }).finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`系統暫時無法運行該功能`);
        })
}