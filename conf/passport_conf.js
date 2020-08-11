const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const connectionPool = require('./db');

module.exports = function (passport) {
  const authenticateUser = async (req, username, password, done) => {
    connectionPool.getConnection((connectionError, connection) => {
      if (connectionError) {
        console.log(connectionError);
      } else {
        connection.query('SELECT * FROM companydb.admin WHERE admin_email = ?', [username], (error, results) => {
          if (error) {
            done('Error occured : ' + error);
          } else if (!results.length) {
            done(null, false);
          } else {
            console.log(results)
            bcrypt.compare(password, results[0].admin_password, (err, result) => {
              if (result) {
                req.session.role = results[0].admin_role;
                req.session.username = results[0].admin_name;
                req.session.company = results[0].company_id;
                done(null, results[0].admin_id);
              } else {
                done(null, false);
              }
            });
          }
          connection.release();
        })
      }
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
    connectionPool.getConnection((connectionError, connection) => {
      if (connectionError) {
        console.log(connectionError);
      } else {
        connection.query('SELECT * FROM companydb.admin WHERE admin_id = ?', [id], (error, results) => {
          if (error) {
            done('Error occered : ' + error);
          } else {
            done(error, results[0].admin_id);
          }
          connection.release();
        })
      }
    })
  });
}

