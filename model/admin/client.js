const connectionPool = require('../../conf/db');

exports.addNewClient = (clientInfo, privilegesId) => {
    var connection;
    var privileges = [];
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                COUNT(*) AS total_client
            FROM
                companydb.admin
            WHERE
                company_id = ?`, [clientInfo.company_id])
        })
        .then(([rows, field]) => {
            if (rows[0].total_client >= 10) throw new Error(`已超過可註冊的管理者上限`);
            else return connection.query(`
            SELECT * 
            FROM
                companydb.admin
            WHERE
                admin_email = ?`, [clientInfo.admin_email])
        })
        .then(([rows, field]) => {
            if (rows.length) throw new Error(`該郵箱已存在數據庫，請使用新的郵箱註冊`);
            else return connection.query(`
            INSERT INTO
                companydb.admin
            SET ?`, [clientInfo])
        })
        .then((result) => {
            if (result[0].affectedRows === 1) {
                for (var i = 0; i < privilegesId.length; i++) {
                    privileges.push([clientInfo.admin_id, privilegesId[i]])
                }
                return connection.query(`
                INSERT INTO
                    companydb.admin_privileges
                    (admin_id, privileges_id)
                VALUES ?`, [privileges]);
            }
            else throw new Error(`資料新增失敗`);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return (`${clientInfo.admin_name} 註冊成功`);
            else throw new Error(`資料新增失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
};

exports.getPrivilegesList = () => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                privileges_id,
                privileges_name,
                privileges_description
            FROM
                companydb.privileges`);
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

exports.getClient = (clientId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                admin_email,    
                admin.admin_id,
                admin.admin_name,
                privileges.privileges_id,
                privileges.privileges_name,
                privileges.privileges_description
            FROM
                companydb.admin AS admin
            JOIN
                companydb.admin_privileges AS admin_privileges
                USING (admin_id)
            JOIN
                companydb.privileges as privileges
                USING (privileges_id)
            WHERE
                admin.admin_id = ?`, [clientId]);
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

exports.getClientList = (role, company_id, pageInfo) => {
    var connection;
    var pageSize = 10;
    var numberOfRows, numberOfPages;
    var numberPerPage = parseInt(pageSize, 10) || 1;
    var page = parseInt(pageInfo.page, 10) || 1;
    var skip = (page - 1) * numberPerPage;
    var limit = `${skip} , ${numberPerPage}`;
    var query;

    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            if (role) query = `
            SELECT
                COUNT(*) AS total_client
            FROM
                companydb.admin
            WHERE
                admin_role = 0`;
            else query = `
            SELECT
                COUNT(*) AS total_client
            FROM
                companydb.admin
            WHERE
                admin_role = 0
                AND company_id = '${company_id}'`;
            return connection.query(query);
        })
        .then(([rows, field]) => {
            numberOfRows = rows[0].total_client;
            numberOfPages = Math.ceil(numberOfRows / numberPerPage);
            if (role) {
                query = `
                SELECT
                    admin.admin_id,
                    admin.admin_name,
                    company.company_name,
                    company.company_official_id,
                    DATE_FORMAT(last_login, '%d-%c-%Y %H:%i:%s') AS last_login
                FROM
                    companydb.admin AS admin
                JOIN
                    companydb.company AS company
                    USING (company_id)
                WHERE
                    admin_role = 0
                LIMIT ${limit}`;
            } else {
                query = `
                SELECT
                    admin_id,
                    admin_name,
                    admin_email,
                    DATE_FORMAT(last_login, '%d-%c-%Y %H:%i:%s') AS last_login
                FROM
                    companydb.admin
                WHERE
                    company_id = '${company_id}'
                LIMIT ${limit}`;
            }
            return connection.query(query);
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

exports.getCompanyList = () => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                company_id,
                company_name
            FROM
                companydb.company
            WHERE
                company_id <> '1'`);
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

exports.updateClient = (clientId, clientInfo, privilegesId, companyId) => {
    var connection;
    var privileges = [];
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                COUNT(*) AS importantPrivileges
            FROM
                companydb.admin AS admin
            JOIN
                companydb.admin_privileges
                USING (admin_id)
            JOIN
                companydb.privileges AS privileges
                USING(privileges_id)
            WHERE
                admin.company_id = ?
                AND privileges.privileges_id = 3`, [companyId])
        })
        .then(([rows, field]) => {
            if (!privilegesId.includes("3") && rows[0].importantPrivileges === 1)
                throw new Error(`至少需要一位管理者擁有用戶管理權限`);
            else return connection.query(`
            DELETE FROM
                companydb.admin_privileges
            WHERE
                admin_id = ?`, [clientId]);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) {
                for (var i = 0; i < privilegesId.length; i++) {
                    privileges.push([clientId, privilegesId[i]]);
                }
                return connection.query(`
                INSERT INTO
                    companydb.admin_privileges
                    (admin_id, privileges_id)
                VALUES ?`, [privileges]);
            } else throw new Error(`資料更新失敗`);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return connection.query(`
            UPDATE
                companydb.admin
            SET ?
            WHERE
                admin_id = ?`, [clientInfo, clientId]);
            else throw new Error(`資料更新失敗`);
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (`${clientInfo.admin_name} 資料更新成功`);
            else return (`權限刷新成功`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
};

exports.deleteClient = (clientId, currentLoginUser) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            if (clientId === currentLoginUser.toString()) throw new Error(`该帐号目前为使用状态，无法被删除`);
            else return connection.query(`
            DELETE FROM
                companydb.admin
            WHERE
                admin_id = ?`, [clientId]);
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (`資料刪除成功`);
            else throw new Error(`資料刪除失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
};