const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const connectionPool = require('./db');

module.exports = function (passport) {
  const authenticateUser = (req, username, password, done) => {
    connectionPool.getConnection((connectionError, connection) => {
      if (connectionError) throw connectionError;
      return connection.promise().query(`SELECT * FROM companydb.admin WHERE admin_email = ?`, [username])
        .then(([rows, fields]) => {
          if (!rows.length) done(null, false)
          bcrypt.compare(password, rows[0].admin_password, (err, result) => {
            if (result) {
              req.session.role = rows[0].admin_role;
              req.session.username = rows[0].admin_name;
              req.session.company = rows[0].company_id;
              return (rows, connection.promise().query(`UPDATE companydb.admin SET last_login = NOW() WHERE admin_id = ?`, rows[0].admin_id))
                .then((result) => {
                  if (result[0].affectedRows === 1) {
                    done(null, rows[0].admin_id);
                    connection.release()
                  }
                })
            } else {
              console.log(`Bcyypt Error ${err}`)
              done(null, false);
            }
          });
        })
        .catch((err) => {
          done('Catch error occured : ' + err);
        })
    })
  }

  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, authenticateUser))

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (id, done) {
    connectionPool.getConnection((err, connection) => {
      return connection.promise().query(`SELECT * FROM companydb.admin WHERE admin_id = ?`, [id])
        .then(([rows, fields]) => {
          done(null, rows[0].admin_id);
          connection.release()
        })
        .catch((err) => {
          done('Catch error occured : ' + err);
        })
    })
  });
}

