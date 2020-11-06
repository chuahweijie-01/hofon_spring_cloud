const connectionPool = require('../../conf/db');

exports.orderReport = (companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT order_id, YEAR(trade_date) AS tradeYear, MONTH(trade_date) AS tradeMonth, DAY(trade_date) AS tradeDate, COUNT(*) AS totalOrder, SUM(order_total_item) AS totalItem
            FROM orderdb.order WHERE company_id = ? AND MONTH(trade_date) = MONTH(CURRENT_DATE()) AND YEAR(trade_date) = YEAR(CURRENT_DATE()) GROUP BY tradeDate`, [companyId]);
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

exports.orderStatistic = (companyId, month, year) => {
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

exports.getPanelBoardSummary = (companyId) => {
    //Category, Product, User and Product Sold Total
    var connection;
    var totalProduct, totalCategory, totalUser;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT
            (SELECT COUNT(*) FROM productdb.product WHERE company_id = ?) AS totalProduct,
            (SELECT COUNT(*)FROM userdb.user AS user
            JOIN userdb.user_company AS user_company ON user_company.user_id = user.user_id
            WHERE user_company.company_id = ?) AS totalUser,
            (SELECT SUM(order_total_item) FROM orderdb.order WHERE company_id = ?) AS totalSales,
            (SELECT SUM(order_total_item) FROM orderdb.order WHERE company_id = ? AND MONTH(trade_date) = MONTH(CURRENT_DATE())) AS currentMonthSales`, [companyId, companyId, companyId, companyId, companyId]);
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

exports.getRevenueReport = (companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT YEAR(CURRENT_DATE()) AS year, MONTH(trade_date) AS month, COALESCE(SUM(order_final_price), 0) AS total FROM orderdb.order
            WHERE company_id = ? AND YEAR(trade_date) = YEAR(CURRENT_DATE()) GROUP BY MONTH(trade_date)`, [companyId])
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

exports.getRevenueReportByMonth = (companyId, year, month) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT YEAR(CURRENT_DATE()) AS year, MONTH(trade_date) AS month, DAY(trade_date) AS day, COALESCE(SUM(order_final_price), 0) AS total FROM orderdb.order
            WHERE company_id = ? AND YEAR(trade_date) = ? AND MONTH(trade_date) = ? GROUP BY DAY(trade_date)`, [companyId, year, month])
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

exports.getUserRecord = (companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT user.user_name, user.user_email, DATE_FORMAT(user.created_date, '%d-%c-%Y %H:%i:%s') AS created_date FROM userdb.user AS user
            JOIN userdb.user_company AS user_company ON user.user_id = user_company.user_id
            WHERE user_company.company_id = ? ORDER BY created_date DESC LIMIT 10`, [companyId])
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
