const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const helmet = require('helmet');
const dotenv = require('dotenv').config()
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const connection = require('./conf/db');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override')
const cors = require('cors');
const morgan = require('morgan');
const sessionStore = new MySQLStore({}, connection);
const passport = require('passport');
const flash = require('connect-flash');

//WED ADMIN ROUTES
const user = require('./route/admin/user');
const client = require('./route/admin/client');
const product = require('./route/admin/product');
const company = require('./route/admin/company');
const web_auth = require('./route/admin/web_auth');
const dashboard = require('./route/admin/dashboard');
const discount = require('./route/admin/discount');
const category = require('./route/admin/category');
const award = require('./route/admin/award');
const order = require('./route/admin/order');
const invoice = require('./route/admin/invoice');
const ads = require('./route/admin/ads');
const mobile = require('./route/admin/mobile');
const admin = require('./route/admin/admin');
const album = require('./route/admin/album');
const world = require('./route/admin/world');
const analysis = require('./route/admin/analysis');
const zone = require('./route/admin/zone');
const errorPage = require('./route/admin/error');

//REACT NATIVE ROUTES
const mobile_auth = require('./route/mobile_user/mobile_auth');
const m_company = require('./route/mobile_user/company');
const m_product = require('./route/mobile_user/product');
const m_cart = require('./route/mobile_user/cart');
const m_user = require('./route/mobile_user/user');
const m_order = require('./route/mobile_user/order');
const m_paymentGateway = require('./route/mobile_user/paymentGateway');
const m_analysis = require('./route/mobile_user/analysis');

//3RD PARTY ROUTES
const analysis3rdParty = require('./route/third_party_application/analysis');
const user3rdParty = require('./route/third_party_application/user');

//TEST CASE ROUTES
const testEndPoint = require('./route/test/test');

const middlewares = require('./middleware/middlewares');
const passport_conf = require('./conf/passport_conf')(passport);

app.use(cookieParser());

app.use(helmet());
//app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('views', './view');
app.set('view engine', 'ejs');
app.use(session({
    secret: 'secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        //maxAge: 365 * 24 * 60 * 60 * 1000
        maxAge: 8 * 60 * 60 * 1000
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride('_method'));
app.use((req, res, next) => {
    if (req.query._method == 'DELETE') {
        req.method = 'DELETE';
        req.url = req.path;
    } else if (req.query._method == 'PUT') {
        req.method = 'PUT';
        req.url = req.path;
    }
    next();
})

app.use((req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.session.username;
    }
    next();
})

app.use((req, res, next) => {
    res.locals.isAdmin = req.session.isAdmin;
    next();
})

app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

//REACT NATIVE ENDPOINT
app.use('/mobile', mobile_auth);
app.use('/mobile/api/cart', m_cart);
app.use('/mobile/api/user', m_user);
app.use('/mobile/api/order', m_order);
app.use('/mobile/api/company', m_company);
app.use('/mobile/api/product', m_product);
app.use('/mobile/api/analysis', m_analysis);
app.use('/mobile/api/payment', m_paymentGateway);

//3RD PARTY ENDPOINT
app.use('/analysisResult', analysis3rdParty);
app.use('/user', user3rdParty);

//TEST CASE ENDPOINT
app.use('/test/v1', testEndPoint);

//WEB ADMIN ENDPOINT
app.use('/', web_auth);
app.use('/api/user', middlewares.checkAuthenticated, user);
app.use('/api/client', middlewares.checkAuthenticated, client);
app.use('/api/company', middlewares.checkAuthenticated, company);
app.use('/api/product', middlewares.checkAuthenticated, product);
app.use('/api/discount', middlewares.checkAuthenticated, discount);
app.use('/api/dashboard', middlewares.checkAuthenticated, dashboard);
app.use('/api/category', middlewares.checkAuthenticated, category);
app.use('/api/award', middlewares.checkAuthenticated, award);
app.use('/api/order', middlewares.checkAuthenticated, order);
app.use('/api/invoice', middlewares.checkAuthenticated, invoice);
app.use('/api/ads', middlewares.checkAuthenticated, ads);
app.use('/api/mobile', middlewares.checkAuthenticated, mobile);
app.use('/api/admin', middlewares.checkAuthenticated, admin);
app.use('/api/album', middlewares.checkAuthenticated, album);
app.use('/api/world', middlewares.checkAuthenticated, world);
app.use('/api/analysis', middlewares.checkAuthenticated, analysis);
app.use('/api/zone', middlewares.checkAuthenticated, zone);
app.use('/api/error', errorPage);

var port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Listening to Port : ${port} ... `));