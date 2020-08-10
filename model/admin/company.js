const mysql = require('mysql');
const connectionPool = require('../../conf/db');

exports.add_company = (company_info) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if(connectionError) {
                reject(connectionError);
            } else {
                connection.query('INSERT INTO companydb.company SET ?', company_info, (error, result) => {
                    if(error) {
                        console.error('SQL Error : ', error);
                        reject(error);
                    } else if (result.affectedRows === 1){
                        console.log(result)
                        resolve(company_info.company_name);
                    }
                    connection.release();
                });
            }
        });
    });
};

exports.company_list = () => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if(connectionError) {
                reject(connectionError);
            } else {
                connection.query('SELECT * FROM companydb.company', (error, result) => {
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

exports.company = (company_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if(connectionError) {
                reject(connectionError);
            } else {
                connection.query('SELECT * FROM companydb.company WHERE company_id = ?', [company_id], (error, result) => {
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

exports.update_company = (company_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if(connectionError) {
                reject(connectionError);
            } else {
                connection.query('SELECT * FROM companydb.company WHERE company_id = ?', [company_id], (error, result) => {
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

exports.company_delete = (company_id) => {
    return new Promise((resolve, reject) => {
        connectionPool.getConnection((connectionError, connection) => {
            if(connectionError) {
                reject(connectionError);
            } else {
                connection.query('DELETE FROM companydb.company WHERE company_id = ?', [company_id], (error, result) => {
                    if(error) {
                        console.error('SQL Error : ', error);
                        reject(error);
                    } else if (result.affectedRows === 1) {
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