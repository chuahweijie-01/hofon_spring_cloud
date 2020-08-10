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
        connection.query('SELECT * FROM expressdb.user WHERE username = ?', [username], (error, results) => {
          if (error) {
            done('Error occered : ' + error);
          } else if (!results.length) {
            done(null, false);
          } else {
            bcrypt.compare(password, results[0].password, (err, result) => {
              if (result) {
                req.session.role = results[0].userrole;
                req.session.username = results[0].username;
                done(null, results[0].user_id);
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
        connection.query('SELECT * FROM user WHERE user_id = ?', [id], (error, results) => {
          if (error) {
            done('Error occered : ' + error);
          } else {
            done(error, results[0].user_id);
          }
          connection.release();
        })
      }
    })
  });
}

