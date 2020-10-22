const connectionPool = require('../../conf/db');

exports.addNewCategory = (categoryName, companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT * FROM productdb.category WHERE category_name = ?`, [categoryName])
        })
        .then(([rows, field]) => {
            if (rows.length) throw new Error(`該類別已存在數據庫，請使用新的類別名稱`);
            else return connection.query(`INSERT INTO productdb.category (category_name) VALUES (?)`, [categoryName])
        })
        .then((result) => {
            if (result[0].affectedRows === 1) {
                var company = [];
                for (var i = 0; i < companyId.length; i++) {
                    company.push([companyId[i], result[0].insertId])
                }
                return connection.query(`INSERT INTO companydb.company_category (company_id, category_id) VALUES ?`, [company]);
            }
            else throw new Error(`資料新增失敗`);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return (`${categoryName} 新增成功`);
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

exports.getCompanyList = () => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT company_id, company_official_id, company_name FROM companydb.company WHERE company_id <> '1'`)
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

exports.getCategory = (categoryId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT category.category_id, category.category_name, company.company_id, company.company_name FROM productdb.category AS category
                                     JOIN companydb.company_category AS company_category ON category.category_id = company_category.category_id
                                     JOIN companydb.company as company ON company_category.company_id = company.company_id WHERE category.category_id = ?`, [categoryId])
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

exports.getCategoryList = (pageInfo) => {
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
            return connection.query(`SELECT COUNT(*) AS total_category FROM productdb.category`)
        })
        .then(([rows, field]) => {
            numberOfRows = rows[0].total_product;
            numberOfPages = Math.ceil(numberOfRows / numberPerPage);
            return connection.query(`SELECT COUNT(*) AS total_company, company_category.category_id, category.category_name,
                                     DATE_FORMAT(category.last_update, '%d-%c-%Y %H:%i:%s') AS last_update
                                     FROM companydb.company_category AS company_category
                                     JOIN productdb.category AS category ON company_category.category_id = category.category_id
                                     GROUP BY category.category_name LIMIT ${limit}`)
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

exports.updateCategory = (categoryInfo, companyId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`DELETE FROM companydb.company_category WHERE category_id = ?`, [categoryInfo.category_id])
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) {
                var company = [];
                for (var i = 0; i < companyId.length; i++) {
                    company.push([companyId[i], categoryInfo.category_id])
                }
                return connection.query(`INSERT INTO companydb.company_category (company_id, category_id) VALUES ?`, [company])
            } else throw new Error(`資料更新失敗`);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return connection.query(`UPDATE productdb.category SET ? WHERE category_id = ?`, [categoryInfo, categoryInfo.category_id]);
            else throw new Error(`資料更新失敗`);
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (`${categoryInfo.category_name} 資料更新成功`);
            else return (`關聯公司刷新成功`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error('資料更新失敗');
        })
        .finally(() => {
            connection.release();
        })
};

exports.deleteCategory = (categoryId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`DELETE FROM productdb.category WHERE category_id = ?`, [categoryId])
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