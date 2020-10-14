const connection = require('../../conf/db');
const connectionPool = require('../../conf/db');

exports.add_company = (company_info) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`INSERT INTO companydb.company SET ?`, [company_info])
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (result[0].insertId);
            else throw new Error(`資料新增失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料新增失敗');
        })
        .finally(() => {
            connection.release();
        })
};

exports.company_list = (page_info) => {
    var page_size = 10;
    var number_of_rows, number_of_pages;
    var number_per_page = parseInt(page_size, 10) || 1;
    var page = parseInt(page_info.page, 10) || 1;
    var skip = (page - 1) * number_per_page;
    var limit = `${skip} , ${number_per_page}`;

    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT COUNT(*) AS total_company FROM companydb.company`)
                .then(([rows, field]) => {
                    number_of_rows = rows[0].total_company;
                    number_of_pages = Math.ceil(number_of_rows / number_per_page);
                    return connection.query(`SELECT company_id, company_official_id, company_name, DATE_FORMAT(created_date, '%D %M %Y %H:%i:%s') AS created_date
                                             FROM companydb.company WHERE company_id <> '1' LIMIT ${limit}`)
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
                .finally(() => {
                    connection.release();
                })
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('系統暫時無法運行該功能');
        })
};

exports.company = (company_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT * FROM companydb.company WHERE company_id = ?`, [company_id])
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
};

exports.company_update = (company_id, company_info) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`UPDATE companydb.company SET ? WHERE company_id = ?`, [company_info, company_id])
                .then((result) => {
                    if (result[0].info.match('Changed: 1')) return (`資料更新成功`);
                    else return (`資料沒有異動`);
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

exports.company_delete = (company_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`DELETE FROM companydb.company WHERE company_id = ?`, [company_id])
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

exports.update_company_logo = (image_info, company_id) => {
    var connection, image_path;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT company_logo FROM companydb.company WHERE company_id = ?`, [company_id])
        })
        .then(([rows, field]) => {
            image_path = rows;
            return connection.query(`UPDATE companydb.company SET ? WHERE company_id = ?`, [image_info, company_id])
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (image_path);
            else return (`資料沒有異動`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料更新失敗');
        })
        .finally(() => {
            connection.release();
        })
}

exports.update_company_logo = (image_info, company_id) => {
    var connection, image_path;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT company_logo FROM companydb.company WHERE company_id = ?`, [company_id])
        })
        .then(([rows, field]) => {
            image_path = rows;
            return connection.query(`UPDATE companydb.company SET ? WHERE company_id = ?`, [image_info, company_id])
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (image_path);
            else return (`資料沒有異動`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料更新失敗');
        })
        .finally(() => {
            connection.release();
        })
}

exports.update_company_bank_image = (image_info, company_id) => {
    var connection, image_path;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT company_bank_image FROM companydb.company WHERE company_id = ?`, [company_id])
        })
        .then(([rows, field]) => {
            image_path = rows;
            return connection.query(`UPDATE companydb.company SET ? WHERE company_id = ?`, [image_info, company_id])
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (image_path);
            else return (`資料沒有異動`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料更新失敗');
        })
        .finally(() => {
            connection.release();
        })
}