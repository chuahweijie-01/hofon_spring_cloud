const mysql = require('mysql');

const connectionPool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'hofonspring',
    password: '0000',
    database: 'unknown'
  });