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
            return connection.query(`SELECT COUNT(*) AS total_order FROM orderdb.order WHERE company_id = ?`, [company_id])
        })
        .then(([rows, field]) => {
            number_of_rows = rows[0].total_order;
            number_of_pages = Math.ceil(number_of_rows / number_per_page);
            return connection.query(`SELECT order_id, order_total_item, order_final_price, order_status, 
                               DATE_FORMAT(created_date, '%D %M %Y %H:%i:%s') AS created_date FROM orderdb.order
                               WHERE company_id = ? AND order_status = 1 LIMIT ${limit}`, [company_id])
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