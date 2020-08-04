const mysql = require('mysql');

var options = {
    host        : process.env.MYSQL_HOST,
    port        : process.env.MYSQL_PORT,
    user        : process.env.MYSQL_USER,
    password    : process.env.MYSQL_PASSWORD,
    database    : 'expressdb'
}

var connection = mysql.createPool(options);

module.exports = connection;