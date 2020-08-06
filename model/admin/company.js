const mysql = require('mysql');

const connectionPool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'hofonspring',
    password: '0000',
    database: 'unknown'
  });

exports.addCompany = (insertValues) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if(connectionError) {
                reject(connectionError);
            } else {
                connection.query('INSERT INTO company SET ?', insertValues, (error, result) => {
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