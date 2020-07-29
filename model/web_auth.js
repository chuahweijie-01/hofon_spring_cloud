const mysql = require('mysql');
const connectionPool = require('../conf/db');

exports.auth = (username) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query('SELECT * FROM user WHERE username = ?', username, function (error, results, fields) {
                    if (results.length > 0) {
                        resolve(results);
                    } else {
                        resolve(null);
                    }
                });
            }
            connection.release();
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