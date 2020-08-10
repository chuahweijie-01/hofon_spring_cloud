const mysql = require('mysql');
const connectionPool = require('../../conf/db');

exports.add_admin = (insertValues) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if(connectionError) {
                reject(connectionError);
            } else {
                connection.query('INSERT INTO admin SET ?', insertValues, (error, result) => {
                    if(error) {
                        console.error('SQL Error : ', error);
                        reject(error);
                    } else if (result.affectedRows === 1){
                        resolve('SUCCESS');
                    }
                    connection.release();
                });
            }
        });
    });
};

exports.admin_list = () => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if(connectionError) {
                reject(connectionError);
            } else {
                connection.query('SELECT * FROM companydb.admin WHERE admin_role = 1', (error, result) => {
                    if(error) {
                        console.error('SQL Error : ', error);
                        reject(error);
                    } else if (result.length > 0) {
                        resolve(result)
                    } else {
                        resolve(result);
                        //reject(1)
                    }
                    connection.release();
                });
            }
        });
    });
};