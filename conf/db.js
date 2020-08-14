const mysql = require('mysql2');

const options = {
    host        : process.env.MYSQL_HOST,
    port        : process.env.MYSQL_PORT,
    user        : process.env.MYSQL_USER,
    password    : process.env.MYSQL_PASSWORD,
    database    : 'companydb'
}

const connection = mysql.createPool(options);

module.exports = connection;