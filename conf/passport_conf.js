const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const connectionPool = require('./db');

module.exports = function (passport) {
    /*const authenticateUser = (req, username, password, done) => {
        connectionPool.getConnection()
            .then((connection) => {
                return connection.query(`SELECT * FROM companydb.admin WHERE admin_email = ?`, [username])
                    .then(([rows, fields]) => {
                        if (!rows.length) done(null, false)
                        bcrypt.compare(password, rows[0].admin_password, (err, result) => {
                            if (result) {
                                req.session.isAdmin = rows[0].admin_role;
                                req.session.username = rows[0].admin_name;
                                req.session.company = rows[0].company_id;
                                return (rows, connection.query(`UPDATE companydb.admin SET last_login = NOW() WHERE admin_id = ?`, rows[0].admin_id))
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
                        })
                    })
            })
            .catch((err) => {
                done('Catch error occured : ' + err);
            })
    }*/

    const authenticateUser = (req, username, password, done) => {
        var connection, adminId;
        connectionPool.getConnection()
            .then((connect) => {
                connection = connect;
                return connection.query(`
                SELECT *
                FROM
                    companydb.admin
                WHERE
                    admin_email = ?`, [username])
            })
            .then(([rows, fields]) => {
                if (!rows.length) done(null, false)
                bcrypt.compare(password, rows[0].admin_password, (err, result) => {
                    if (result) {
                        req.session.isAdmin = rows[0].admin_role;
                        req.session.username = rows[0].admin_name;
                        req.session.company = rows[0].company_id;
                        adminId = rows[0].admin_id;
                        return (rows, connection.query(`
                        UPDATE
                            companydb.admin
                        SET
                            last_login = NOW()
                        WHERE
                            admin_id = ?`, [adminId]))
                            .then((result) => {
                                if (result[0].affectedRows === 1) {
                                    done(null, adminId);
                                }
                            })
                    } else done(null, false);
                })
            })
            .catch((err) => {
                done('Catch error occured : ' + err);
            })
            .finally(() => {
                connection.release();
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
        var connection;
        connectionPool.getConnection()
            .then((connect) => {
                connection = connect;
                return connection.query(`
                SELECT *
                FROM
                    companydb.admin
                WHERE
                    admin_id = ?`, [id])
            })
            .then(([rows, fields]) => {
                done(null, rows[0].admin_id);
            })
            .catch((err) => {
                done('Catch error occured : ' + err);
            })
            .finally(() => {
                connection.release();
            })
    });
}

