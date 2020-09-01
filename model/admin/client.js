const connectionPool = require('../../conf/db');

exports.client_create = (client_info, privileges_id) => {
    return connectionPool.getConnection()
        .then((connection) => {
            return connection.query(`SELECT COUNT(*) AS total_client FROM companydb.admin WHERE company_id = ?`, [client_info.company_id])
                .then(([rows, field]) => {
                    if (rows[0].total_client >= 10) throw new Error(`已超過可註冊的管理者上限`);
                    else return connection.query(`SELECT * FROM companydb.admin WHERE admin_email = ?`, [client_info.admin_email])
                })
                .then(([rows, field]) => {
                    if (rows.length) throw new Error(`該郵箱已存在數據庫，請使用新的郵箱註冊`);
                    else return connection.query(`INSERT INTO companydb.admin SET ?`, [client_info])
                })
                .then((result) => {
                    if (result[0].affectedRows === 1) {
                        privileges = [];
                        for (var i = 0; i < privileges_id.length; i++) {
                            privileges.push([result[0].insertId, privileges_id[i]])
                        }
                        return connection.query(`INSERT INTO companydb.admin_privileges (admin_id, privileges_id) VALUES ?`, [privileges]);
                    }
                    else throw new Error(`資料新增失敗`);
                })
                .then((result) => {
                    if (result[0].affectedRows >= 1) return (`${client_info.admin_name} 註冊成功`);
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

exports.privileges_list = () => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT privileges_id, privileges_name, privileges_description FROM companydb.privileges`)
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('系統暫時無法運行該功能');
        })
        .finally(() => {
            connection.release();
        })
};

exports.client_display = (client_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT admin.admin_id, admin.admin_name, admin_email, privileges.privileges_id, privileges.privileges_name,
                                     privileges.privileges_description FROM companydb.admin AS admin
                                     JOIN companydb.admin_privileges AS admin_privileges ON admin.admin_id = admin_privileges.admin_id
                                     JOIN companydb.privileges as privileges ON admin_privileges.privileges_id = privileges.privileges_id
                                     WHERE admin.admin_id = ?`, [client_id])
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('系統暫時無法運行該功能');
        })
        .finally(() => {
            connection.release();
        })
};

exports.client_display_list = (role, company_id, page_info) => {
    var connection;
    var page_size = 10;
    var number_of_rows, number_of_pages;
    var number_per_page = parseInt(page_size, 10) || 1;
    var page = parseInt(page_info.page, 10) || 1;
    var skip = (page - 1) * number_per_page;
    var limit = `${skip} , ${number_per_page}`;
    var query;

    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            if (role == 1) {
                query = `SELECT COUNT(*) AS total_client FROM companydb.admin
                         WHERE admin_role = 0`;
            } else {
                query = `SELECT COUNT(*) AS total_client FROM companydb.admin
                         WHERE admin_role = 0 AND company_id = ${company_id}`;
            }
            return connection.query(query)
        })
        .then(([rows, field]) => {
            number_of_rows = rows[0].total_client;
            number_of_pages = Math.ceil(number_of_rows / number_per_page);
            if (role == 1) {
                query = `SELECT admin.admin_id, admin.admin_name, company.company_name, company.company_official_id,
                         DATE_FORMAT(last_login, '%D %M %Y %H:%i:%s') AS last_login FROM companydb.admin AS admin
                         JOIN companydb.company AS company ON admin.company_id = company.company_id
                         WHERE admin_role = 0 LIMIT ${limit}`;
            } else {
                query = `SELECT admin_id, admin_name, admin_email, DATE_FORMAT(last_login, '%D %M %Y %H:%i:%s') AS last_login
                         FROM companydb.admin WHERE company_id = ${company_id} LIMIT ${limit}`;
            }
            return connection.query(query)
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
            throw new Error('系統暫時無法運行該功能');
        })
        .finally(() => {
            connection.release();
        })
};

exports.company_list = () => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT company_id, company_name FROM companydb.company`)
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('系統暫時無法運行該功能');
        })
        .finally(() => {
            connection.release();
        })
};

exports.client_update = (client_id, client_info, privileges_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`DELETE FROM companydb.admin_privileges WHERE admin_id = ?`, [client_id])
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) {
                privileges = [];
                for (var i = 0; i < privileges_id.length; i++) {
                    privileges.push([client_id, privileges_id[i]])
                }
                return connection.query(`INSERT INTO companydb.admin_privileges (admin_id, privileges_id) VALUES ?`, [privileges])
            } else throw new Error(`資料更新失敗`);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return connection.query(`UPDATE companydb.admin SET ? WHERE admin_id = ?`, [client_info, client_id]);
            else throw new Error(`資料更新失敗`);
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (`${client_info.admin_name} 資料更新成功`);
            else return (`權限刷新成功`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料更新失敗');
        })
        .finally(() => {
            connection.release();
        })
};

exports.client_delete = (client_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`DELETE FROM companydb.admin WHERE admin_id = ?`, [client_id])
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (`資料刪除成功`);
            else throw new Error(`資料刪除失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料刪除失敗');
        })
        .finally(() => {
            connection.release();
        })
};