const { connect } = require('mysql2');
const connectionPool = require('../../conf/db');

exports.addNewCountry = (countryInfo) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            INSERT INTO
                userdb.country
            SET ?`, [countryInfo])
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (`${countryInfo.country_name_chinese} 新增成功，請在 編輯 選項裏添加城市。`);
            else throw new Error(`資料新增失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
}

exports.addNewCity = (countryInfo) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            INSERT INTO
                userdb.city
            SET ?`, [countryInfo])
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (`${countryInfo.city_name} 新增成功`);
            else throw new Error(`${countryInfo.city_name} 新增失敗`);
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
}

exports.updateCountry = (countryInfo, countryId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            UPDATE
                userdb.country
            SET ?
            WHERE
                country_id = ?`, [countryInfo, countryId]);
        })
        .then((result) => {
            if (result[0].info.match('Changed: 1')) return (`資料更新成功`);
            else return ('資料沒有異動');
        })
        .catch((err) => {
            console.error(err);
            throw new Error('資料更新失敗');
        })
        .finally(() => {
            connection.release();
        })
}

exports.getCountryList = (pageInfo) => {
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
            return connection.query(`
            SELECT
                COUNT(*) AS total_country
            FROM
                userdb.country`)
        })
        .then(([rows, field]) => {
            numberOfRows = rows[0].total_country;
            numberOfPages = Math.ceil(numberOfRows / numberPerPage);
            return connection.query(`
            SELECT
                country.country_id,
                country.country_name_chinese,
                country.country_name_english,
                country.country_code,
                COUNT(*) AS total_city
            FROM
                userdb.country AS country
            LEFT JOIN
                userdb.city AS city
                ON country.country_id = city.country_id
            GROUP BY
                country.country_id
            ORDER BY
                country.country_code
            LIMIT ${limit}`)
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

exports.getCountry = (countryId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            SELECT
                country.country_id,
                country.country_name_chinese,
                country.country_name_english,
                country.country_code,
                city.city_id,
                city.city_name
            FROM
                userdb.country AS country
            LEFT JOIN
                userdb.city AS city
                ON country.country_id = city.country_id
            WHERE
                country.country_id = ?
            ORDER BY
                city.city_id`, [countryId])
        })
        .then(([rows, field]) => {
            return rows
        })
        .catch((err) => {
            console.error(err);
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.deleteCountry = (countryId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            DELETE FROM
                userdb.country
            WHERE
                country_id = ?`, [countryId])
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

exports.deleteCity = (cityId) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`
            DELETE FROM
                userdb.city
            WHERE
                city_id = ?`, [cityId])
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