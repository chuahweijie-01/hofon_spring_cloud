const mysql = require('mysql');
const bcrypt = require('bcrypt');

const connectionPool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'hofonspring',
    password: '0000',
    database: 'unknown'
});

exports.userLogin = (insertValues) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query('SELECT * FROM user WHERE user_name = ?', insertValues.user_name, (error, result) => {
                    if (error) {
                        console.error('SQL Error : ', error);
                        reject(error);
                    } if (results.length > 0) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });
            }
        });
    });
};

exports.insert = (insertValues) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query('INSERT INTO user SET ?', insertValues, (error, result) => {
                    if (error) {
                        console.error('SQL error: ', error);
                        reject(error);
                    } else if (result.affectedRows === 1) {
                        resolve(result);
                    }
                    connection.release();
                });
            }
        });
    });
};