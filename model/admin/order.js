const connectionPool = require('../../conf/db');

exports.order_display_list = (company_id) => {
  var connection;
  return connectionPool.getConnection()
    .then((connect) => {
      connection = connect;
      return connection.query(`SELECT * FROM orderdb.order WHERE company_id = ?`, [company_id])
    })
    .then(([rows, field]) => {
      return (rows);
    })
    .catch((err) => {
      console.error(`CATCH ERROR : ${err}`);
      throw new Error(err);
    })
    .finally(() => {
      connection.release()
    })
}