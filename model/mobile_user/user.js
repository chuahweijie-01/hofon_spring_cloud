const connectionPool = require('../../conf/db');

exports.user_address = (user_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT address.address_id, address.address_detail, city.city_name, country.country_name_chinese
                                     FROM userdb.user AS user
                                     JOIN userdb.user_address AS user_address ON user.user_id = user_address.user_id
                                     JOIN userdb.address AS address ON user_address.address_id = address.address_id
                                     JOIN userdb.city AS city ON address.city_id = city.city_id
                                     JOIN userdb.country AS country ON city.country_id = country.country_id
                                     WHERE user.user_id = ? `, [user_id])
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料選取失敗');
        })
        .finally(() => {
            connection.release()
        })
}

exports.city = (country_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT city_id, city_name FROM userdb.city WHERE country_id = ?`, [country_id])
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料選取失敗');
        })
        .finally(() => {
            connection.release()
        })
}

exports.country = () => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`SELECT country_id, country_name_chinese FROM userdb.country`)
        })
        .then(([rows, field]) => {
            return (rows);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error('資料選取失敗');
        })
        .finally(() => {
            connection.release()
        })
}

exports.address_delete = (address_id) => {
    var connection;
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`DELETE FROM userdb.address WHERE address_id = ?`, [address_id]);
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (`資料刪除成功`);
            else throw new Error(`資料刪除失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err);
        })
        .finally(() => {
            connection.release()
        })
}

exports.address_create = (user_id, address_info) => {
    var connection;
    console.log(address_info);
    return connectionPool.getConnection()
        .then((connect) => {
            connection = connect;
            return connection.query(`INSERT INTO userdb.address SET ?`, [address_info]);
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return connection.query(`INSERT INTO userdb.user_address(user_id, address_id) VALUES (?,?)`, [user_id, result[0].insertId]);
            else throw new Error(`地址新增失敗`);
        })
        .then((result) => {
            if (result[0].affectedRows === 1) return (`地址註冊成功`);
            else throw new Error(`地址新增失敗`);
        })
        .catch((err) => {
            console.error(`CATCH ERROR : ${err}`);
            throw new Error(err);
        })
        .finally(() => {
            connection.release()
        })
}