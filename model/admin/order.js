const connectionPool = require('../../conf/db');

exports.getOrderList = (companyId, pageInfo) => {
    var connection;
    var pageSize = 50;
    var numberOfRows, numberOfPages;
    var numberPerPage = parseInt(pageSize, 10) || 1;
    var page = parseInt(pageInfo.page, 10) || 1;
    var skip = (page - 1) * numberPerPage;
    var limit = `${skip} , ${numberPerPage}`;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT COUNT(*) AS total_order FROM orderdb.order WHERE company_id = ? AND order_status = 0`, [companyId]);
        })
        .then(([rows, field]) => {
            numberOfRows = rows[0].total_order;
            numberOfPages = Math.ceil(numberOfRows / numberPerPage);
            return connection.query(`SELECT order_id, order_total_item, order_final_price, order_status, DATE_FORMAT(trade_date, '%d-%c-%Y %H:%i:%s') AS trade_date
                                     FROM orderdb.order WHERE company_id = ? AND order_status = 0 ORDER BY trade_date DESC LIMIT ${limit}`, [companyId]);
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
            throw new Error(err);
        })
        .finally(() => {
            connection.release()
        })
}

exports.getOrder = (orderId, companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT * FROM orderdb.order_full_information WHERE order_id = ? AND company_id = ? GROUP BY product_id`, [orderId, companyId]);
        })
        .then(([rows, field]) => {
            if (rows.length) return rows;
            else throw new Error('該訂單已從資料庫中移除')
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err);
        })
        .finally(() => {
            connection.release();
        })
}

exports.updateOrder = (orderId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`UPDATE orderdb.order SET order_status = IF(order_status = 0, 1, order_status) WHERE order_id = ?`, [orderId]);
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (`訂單更新完成`);
            else throw new Error('該訂單交易已是完成狀態')
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
}