const connectionPool = require('../../conf/db');

exports.invoice_display_list = (company_id, page_info) => {
    var connection;
    var page_size = 10;
    var number_of_rows, number_of_pages;
    var number_per_page = parseInt(page_size, 10) || 1;
    var page = parseInt(page_info.page, 10) || 1;
    var skip = (page - 1) * number_per_page;
    var limit = `${skip} , ${number_per_page}`;

    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT COUNT(*) AS total_order FROM orderdb.order WHERE company_id = ? AND order_status = 1`, [company_id])
        })
        .then(([rows, field]) => {
            number_of_rows = rows[0].total_order;
            number_of_pages = Math.ceil(number_of_rows / number_per_page);
            return connection.query(`SELECT order_id, order_total_item, order_final_price, order_status, DATE_FORMAT(last_update, '%D %c %Y %H:%i:%s') AS last_update FROM orderdb.order
                                     WHERE company_id = ? AND order_status <> 0 LIMIT ${limit}`, [company_id])
        })
        .then(([rows, field]) => {
            result = {
                rows: rows,
                pagination: {
                    current: page,
                    number_per_page: number_per_page,
                    has_previous: page > 1,
                    previous: page - 1,
                    has_next: page < number_of_pages,
                    next: page + 1,
                    last_page: Math.ceil(number_of_rows / page_size)
                }
            }
            return (result);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err);
        })
        .finally(() => {
            connection.release()
        })
}

exports.invoice_display = (order_id, company_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT * FROM orderdb.order_full_information WHERE order_id = ? AND company_id = ? GROUP BY product_id`, [order_id, company_id])
        })
        .then(([rows, field]) => {
            return rows;
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.invoice_update = (order_id, order_info) => {
    var connection, current_status;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT order_status FROM orderdb.order WHERE order_id = ?`, [order_id])
        })
        .then(([rows, field]) => {
            current_status = rows[0].order_status;
            return connection.query(`UPDATE orderdb.order SET order_status = ?, order_remarks = ? WHERE order_id = ?`, [order_info.order_status, order_info.order_remarks, order_id])
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1') && current_status === 1)
                return connection.query(`SELECT product_id, quantity FROM orderdb.order_product WHERE order_id = ?`, [order_id]);
            else if (result[0].info.match('Changed: 1'))
                return (`訂單更新完成`);
            else throw new Error(`訂單狀態無法變更`)
        })
        .then(([rows, field]) => {
            for (var i = 0; i < rows.length; i++) {
                connection.query(`UPDATE productdb.product SET product_stock = (product_stock + ?) WHERE product_id = ?`, [rows[i].quantity, rows[i].product_id])
                    .then((result) => {
                        // Update continue ...
                    })
            }
            return (`訂單更新完成`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
}