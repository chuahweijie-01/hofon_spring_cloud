const mysql = require('mysql');

var options = {
    host        : 'localhost',
    port        :  3306,
    user        : 'root',
    password    : 'Cchuahweijie5105-',
    database    : 'expressdb'
}

var connection = mysql.createPool(options);

module.exports = connection;