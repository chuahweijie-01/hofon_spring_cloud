const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const helmet = require('helmet');
const dotenv = require('dotenv').config()
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const connection = require('./conf/db');
const cookieParser = require('cookie-parser');

var sessionStore = new MySQLStore({}, connection);
const passport = require('passport');
const flash = require('connect-flash');

const user = require('./route/admin/user');
const admin = require('./route/admin/admin');
const product = require('./route/admin/product');
const company = require('./route/admin/company');
const web_auth = require('./route/admin/web_auth');
const dashboard = require('./route/admin/dashboard');
const discount = require('./route/admin/discount');
const category = require('./route/admin/category');
const award = require('./route/admin/award');
const order = require('./route/admin/order');
const ads = require('./route/admin/ads');
const mobile = require('./route/admin/mobile')

const middlewares = require('./middleware/middlewares');

const passport_conf = require('./conf/passport_conf')(passport);
app.use(cookieParser());

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('./public'));
app.set('views', './view');
app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use('/', web_auth);
app.use('/api/admin', admin);
app.use('/api/company', company);
app.use('/api/user', user);
app.use('/api/product', product);
app.use('/api/discount', discount);
app.use('/api/dashboard', middlewares.checkAuthenticated, dashboard);
app.use('/api/category', category);
app.use('/api/award', award);
app.use('/api/order', order);
app.use('/api/ads', ads);
app.use('/api/mobile', mobile);

app.get('/api/test', (req, res) => {
    res.render('order');
})

var port = process.env.PORT || 3000
app.listen(3000, () => console.log(`Listening to Port : ${port} ... `));