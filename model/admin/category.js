const connectionPool = require('../../conf/db');

exports.category_create = (category_name, company_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT * FROM productdb.category WHERE category_name = ?`, [category_name])
                .then(([rows, field]) => {
                    if (rows.length) throw new Error(`該類別已存在數據庫，請使用新的類別名稱`);
                    else return connection.query(`INSERT INTO productdb.category (category_name) VALUES (?)`, [category_name])
                })
                .then((result) => {
                    if (result[0].affectedRows === 1) {
                        company = [];
                        for (var i = 0; i < company_id.length; i++) {
                            company.push([company_id[i], result[0].insertId])
                        }
                        return connection.query(`INSERT INTO companydb.company_category (company_id, category_id) VALUES ?`, [company]);
                    }
                    else throw new Error(`資料新增失敗`);
                })
                .then((result) => {
                    if (result[0].affectedRows >= 1) return (`${category_name} 新增成功`);
                    else throw new Error(`資料新增失敗`);
                })
                .finally(() => {
                    connection.release();
                })
        }, err => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料新增失敗');
        })
};

exports.company_list = () => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT company_id, company_official_id, company_name FROM companydb.company`)
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

exports.category_display = (category_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT category.category_id, category.category_name, company.company_id, company.company_name
                                     FROM productdb.category AS category
                                     JOIN companydb.company_category AS company_category
                                     ON category.category_id = company_category.category_id
                                     JOIN companydb.company as company
                                     ON company_category.company_id = company.company_id
                                     WHERE category.category_id = ?`, [category_id])
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

exports.category_display_list = (page_info) => {
    var page_size = 10;
    var number_of_rows, number_of_pages;
    var number_per_page = parseInt(page_size, 10) || 1;
    var page = parseInt(page_info.page, 10) || 1;
    var skip = (page - 1) * number_per_page;
    var limit = `${skip} , ${number_per_page}`;

    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT COUNT(*) AS total_category FROM productdb.category`)
                .then(([rows, field]) => {
                    number_of_rows = rows[0].total_product;
                    number_of_pages = Math.ceil(number_of_rows / number_per_page);
                    return connection.query(`SELECT COUNT(*) AS total_company, company_category.category_id, category.category_name,
                                             DATE_FORMAT(category.last_update, '%D %M %Y %H:%i:%s') AS last_update
                                             FROM companydb.company_category AS company_category
                                             JOIN productdb.category AS category
                                             ON company_category.category_id = category.category_id
                                             GROUP BY category.category_name
                                             LIMIT ${limit}`)
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

exports.category_update = (category_info, company_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`DELETE FROM companydb.company_category WHERE category_id = ?`, [category_info.category_id])
                .then((result) => {
                    if (result[0].affectedRows >= 1) {
                        company = [];
                        for (var i = 0; i < company_id.length; i++) {
                            console.log(company_id[i])
                            company.push([company_id[i], category_info.category_id])
                        }
                        return connection.query(`INSERT INTO companydb.company_category (company_id, category_id) VALUES ?`, [company])
                    } else throw new Error(`資料更新失敗`);
                })
                .then((result) => {
                    if (result[0].affectedRows >= 1) return connection.query(`UPDATE productdb.category SET ? WHERE category_id = ?`, [category_info, category_info.category_id]);
                    else throw new Error(`資料更新失敗`);
                })
                .then((result) => {
                    if (result[0].info.match('Changed: 1')) return (`${category_info.category_name} 資料更新成功`);
                    else return (`關聯公司刷新成功`);
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

exports.category_delete = (category_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`DELETE FROM productdb.category WHERE category_id = ?`, [category_id])
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