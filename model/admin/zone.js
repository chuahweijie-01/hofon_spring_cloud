const connectionPool = require('../../conf/db');

exports.displayZoneList = (pageInfo, companyId) => {
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
            return connection.query(`SELECT zone.zone_id, zone.zone_name, zone.zone_charge, COUNT(*) AS total_city
                                     FROM companydb.zone AS zone
                                     LEFT JOIN companydb.zone_city AS zone_city ON zone.zone_id = zone_city.zone_id
                                     WHERE zone.company_id = ? GROUP BY zone.zone_id LIMIT ${limit}`, [companyId]);
        })
        .then(([rows, field]) => {
            result = {
                rows: rows,
                pagination: {
                    current: page,
                    number_per_page: numberPerPage,
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
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.addNewZone = (zoneInfo) => {

}

exports.updateZone = (zoneId) => {

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
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
}