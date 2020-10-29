const connectionPool = require('../../conf/db');

exports.getZoneList = (pageInfo, companyId) => {
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
            return connection.query(`SELECT COUNT(*) AS totalZone FROM companydb.zone`)
        })
        .then(([rows, field]) => {
            numberOfRows = rows[0].totalZone;
            numberOfPages = Math.ceil(numberOfRows / numberPerPage);
            return connection.query(`SELECT zone.zone_id, zone.zone_name, zone.zone_charge, COUNT(*) AS total_city,
                                     DATE_FORMAT(zone.last_update, '%d-%c-%Y %H:%i:%s') AS last_update FROM companydb.zone AS zone
                                     LEFT JOIN companydb.zone_city AS zone_city ON zone.zone_id = zone_city.zone_id
                                     WHERE zone.company_id = ? GROUP BY zone.zone_id LIMIT ${limit}`, [companyId]);
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
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.getCountry = () => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT country_id, country_name_chinese FROM userdb.country WHERE country_id = 1 ORDER BY country_id`)
        })
        .then(([rows, field]) => {
            return rows;
        })
        .catch((err) => {
            console.error(err);
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.getCity = (countryId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT city.city_id, city.city_name, zone_city.zone_id, zone.zone_name FROM userdb.city AS city
                                     LEFT JOIN companydb.zone_city AS zone_city ON city.city_id = zone_city.city_id
                                     LEFT JOIN companydb.zone AS zone ON zone_city.zone_id = zone.zone_id
                                     WHERE city.country_id = ? ORDER BY zone.zone_name`, [countryId])
        })
        .then(([rows, field]) => {
            return rows;
        })
        .catch((err) => {
            console.error(err);
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
}


exports.addNewZone = (zoneInfo, city_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`INSERT INTO companydb.zone SET ?`, [zoneInfo])
        })
        .then((result) => {
            if (result[0].affectedRows === 1) {
                var city = [];
                for (var i = 0; i < city_id.length; i++) {
                    city.push([zoneInfo.zone_id, city_id[i]])
                }
                return connection.query(`INSERT INTO companydb.zone_city(zone_id, city_id) VALUES ?`, [city])
            } else throw new Error(`資料新增失敗`);
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return (`已新增${zoneInfo.zone_name}區域`);
            else throw new Error(`資料新增失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err);
        })
        .finally(() => {
            connection.release()
        })
}

exports.getZone = (zoneId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT city.city_id, city.city_name, zone_city.zone_id, zone.zone_name, zone.zone_charge FROM userdb.city AS city
                                     LEFT JOIN companydb.zone_city AS zone_city ON city.city_id = zone_city.city_id
                                     LEFT JOIN companydb.zone AS zone ON zone_city.zone_id = zone.zone_id WHERE zone.zone_id = ?`, [zoneId])
        })
        .then(([rows, field]) => {
            return rows;
        })
        .catch((err) => {
            console.error(err);
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.updateZone = (zoneInfo, zoneId, city_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`DELETE FROM companydb.zone_city WHERE zone_id = ?`, [zoneId])
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) {
                var city = [];
                for (var i = 0; i < city_id.length; i++) {
                    city.push([zoneId, city_id[i]])
                }
                return connection.query(`INSERT INTO companydb.zone_city(zone_id, city_id) VALUES ?`, [city])
            } else throw new Error(`資料更新失敗`)
        })
        .then((result) => {
            if (result[0].affectedRows >= 1) return connection.query(`UPDATE companydb.zone SET ? WHERE zone_id = ?`, [zoneInfo, zoneId])
            else throw new Error(`資料更新失敗`)
        })
        .then((result) => {
            if (result[0].affectedRows == 1) return (`資料更新成功`);
            else throw new Error(`資料更新失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err);
        })
        .finally(() => {
            connection.release();
        })
}

exports.deleteZone = (zoneId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`DELETE FROM companydb.zone WHERE zone_id = ?`, [zoneId])
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
}