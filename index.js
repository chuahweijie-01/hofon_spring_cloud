const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const helmet = require('helmet');

const sessionCheck = require('./middleware/sessionCheck')

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const connection = require('./conf/db');

var sessionStore = new MySQLStore({}, connection);



const user = require('./route/user');
const admin = require('./route/admin');
const product = require('./route/product');
const company = require('./route/company');
const web_auth = require('./route/web_auth');
const dashboard = require('./route/dashboard');
const discount = require('./route/discount');
const category = require('./route/category');
const award = require('./route/award');
const order = require('./route/order');

app.set('views', './view');
app.set('view engine', 'ejs');

app.use(session({
    secret              : 'secret',
    store               : sessionStore,
    resave              : false,
    saveUninitialized   : false
}))

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', web_auth);
app.use('/api/admin', admin);
app.use('/api/company', company);
app.use('/api/user', user);
app.use('/api/product', product);
app.use('/api/discount', discount);
app.use('/api/dashboard', dashboard);
app.use('/api/category', category);
app.use('/api/award', award);
app.use('/api/order', order);

var port = process.env.PORT || 3000
app.listen(3000, () => console.log(`Listening to Port : ${port} ... `));