const connectionPool = require('../../conf/db');

exports.world_create = (world_info) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`INSERT INTO userdb.country SET ?`, [world_info])
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (`${world_info.country_name_chinese} 新增成功，請在 編輯 選項裏添加城市。`);
            else throw new Error(`資料新增失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
}

exports.world_city_create = (world_info) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`INSERT INTO userdb.city SET ?`, [world_info])
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (`${world_info.city_name} 新增成功`);
            else throw new Error(`${world_info.city_name} 新增失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err.message);
        })
        .finally(() => {
            connection.release();
        })
}

exports.world_display_list = (page_info) => {
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
            return connection.query(`SELECT COUNT(*) AS total_country FROM userdb.country`)
        })
        .then(([rows, field]) => {
            number_of_rows = rows[0].total_country;
            number_of_pages = Math.ceil(number_of_rows / number_per_page);
            return connection.query(`SELECT country.country_id, country.country_name_chinese, country.country_name_english, country.country_code,
                                     COUNT(*) AS total_city FROM userdb.country AS country
                                     LEFT JOIN userdb.city AS city ON country.country_id = city.country_id GROUP BY country.country_id ORDER BY country.country_code`)
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
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.world_display = (country_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT country.country_id, country.country_name_chinese, country.country_name_english, country.country_code,
                                     city.city_id, city.city_name FROM userdb.country AS country
                                     LEFT JOIN userdb.city AS city ON country.country_id = city.country_id WHERE country.country_id = ? ORDER BY city.city_id`, [country_id])
        })
        .then(([rows, field]) => {
            return rows
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(`系統暫時無法運行該功能`);
        })
        .finally(() => {
            connection.release();
        })
}

exports.world_delete = (country_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`DELETE FROM userdb.country WHERE country_id = ?`, [country_id])
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

exports.world_city_delete = (city_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`DELETE FROM userdb.city WHERE city_id = ?`, [city_id])
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