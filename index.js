const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const helmet = require('helmet');

const sessionCheck = require('./middleware/sessionCheck')

const user = require('./router/user');
const admin = require('./router/admin');
const product = require('./router/product');
const company = require('./router/company');
const web_auth = require('./router/web_auth');
const dashboard = require('./router/dashboard');
const discount = require('./router/discount');
const category = require('./router/category');
const award = require('./router/award');
const order = require('./router/order');

const session = require('express-session');

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

app.set('views', './view');
app.set('view engine', 'ejs');

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