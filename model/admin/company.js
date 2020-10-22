const connectionPool = require('../../conf/db');

exports.addNewCompany = (companyInfo) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`INSERT INTO companydb.company SET ?`, [companyInfo]);
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (result[0].insertId);
            else throw new Error(`資料新增失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('資料新增失敗');
        })
        .finally(() => {
            connection.release();
        })
};

exports.getCompanyList = (pageInfo) => {
    var connection;
    var pageSize = 10;
    var numberOfRows, numberOfPages;
    var numberPerPage = parseInt(pageSize, 10) || 1;
    var page = parseInt(pageInfo.page, 10) || 1;
    var skip = (page - 1) * numberPerPage;
    var limit = `${skip} , ${numberPerPage}`;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT COUNT(*) AS total_company FROM companydb.company`);
        })
        .then(([rows, field]) => {
            numberOfRows = rows[0].total_company;
            numberOfPages = Math.ceil(numberOfRows / numberPerPage);
            return connection.query(`SELECT company_id, company_official_id, company_name, DATE_FORMAT(created_date, '%d-%c-%Y %H:%i:%s') AS created_date
                                     FROM companydb.company WHERE company_id <> '1' LIMIT ${limit}`);
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
            throw new Error('系統暫時無法運行該功能');
        })
        .finally(() => {
            connection.release();
        })
};

exports.getCompany = (companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT * FROM companydb.company WHERE company_id = ?`, [companyId])
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('系統暫時無法運行該功能');
        })
        .finally(() => {
            connection.release();
        })
};

exports.updateCompany = (companyId, companyInfo) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`UPDATE companydb.company SET ? WHERE company_id = ?`, [companyInfo, companyId]);
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (`資料更新成功`);
            else return (`資料沒有異動`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('資料更新失敗');
        })
        .finally(() => {
            connection.release();
        })
};

exports.deleteCompany = (companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`DELETE FROM companydb.company WHERE company_id = ?`, [companyId]);
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (`資料刪除成功`);
            else throw new Error(`資料刪除失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('資料刪除失敗');
        })
        .finally(() => {
            connection.release();
        })
};

exports.updateCompanyLogo = (imageInfo, companyId) => {
    var connection, image_path;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT company_logo FROM companydb.company WHERE company_id = ?`, [companyId]);
        })
        .then(([rows, field]) => {
            image_path = rows;
            return connection.query(`UPDATE companydb.company SET ? WHERE company_id = ?`, [imageInfo, companyId]);
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (image_path);
            else return (`資料沒有異動`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('資料更新失敗');
        })
        .finally(() => {
            connection.release();
        })
}

exports.updateCompanyBankImage = (imageInfo, companyId) => {
    var connection, image_path;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT company_bank_image FROM companydb.company WHERE company_id = ?`, [companyId]);
        })
        .then(([rows, field]) => {
            image_path = rows;
            return connection.query(`UPDATE companydb.company SET ? WHERE company_id = ?`, [imageInfo, companyId]);
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (image_path);
            else return (`資料沒有異動`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('資料更新失敗');
        })
        .finally(() => {
            connection.release();
        })
}