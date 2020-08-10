const mysql = require('mysql');
const connectionPool = require('../../conf/db');

exports.insert = (user) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                connection.query('SELECT * FROM expressdb.user WHERE username = ?', user.username, function (error, results, fields) {
                    if (results.length > 0) {
                        reject(1);
                    } else {
                        connection.query('INSERT INTO user SET ?', user, (error, result) => {
                            if (error) {
                                console.error('SQL error: ', error);
                                reject(error);
                            } else if (result.affectedRows === 1) {
                                resolve(result);
                            } else {
                                reject(error);
                            }
                        });
                    }
                    connection.release();
                })

            }
        });
    });
};