const connection = require('../../conf/db');
const connectionPool = require('../../conf/db');

exports.orderReport = (companyId, month, year) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT order_id, YEAR(trade_date) AS tradeYear, MONTH(trade_date) AS tradeMonth, DAY(trade_date) AS tradeDate, COUNT(*) AS totalOrder, SUM(order_total_item) AS totalItem
            FROM orderdb.order WHERE company_id = ? AND MONTH(trade_date) = ? AND YEAR(trade_date) = ? GROUP BY tradeDate`, [companyId, month, year]);
        })
        .then(([rows, filed]) => {
            return rows;
        })
        .catch((err) => {
            console.error(err);
            throw new Error('系統暫時無法運行該功能');
        })
        .finally(() => {
            connection.release();
        })
}

exports.orderSummary = (companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT
            (SELECT COUNT(*) AS total FROM orderdb.order WHERE order_status = 0) AS pending,
            (SELECT COUNT(*) AS total FROM orderdb.order WHERE order_status = 1) AS done,
            (SELECT COUNT(*) AS total FROM orderdb.order WHERE order_status = 2 OR order_status = 3) AS other,
            (SELECT COUNT(*) AS total FROM orderdb.order) AS total
            FROM orderdb.order WHERE company_id = ? LIMIT 1`, [companyId])
        })
        .then(([rows, field]) => {
            return rows;
        })
        .catch((err) => {
            console.error(err);
            throw new Error('系統暫時無法運行該功能');
        })
        .finally(() => {
            connection.release();
        })
}