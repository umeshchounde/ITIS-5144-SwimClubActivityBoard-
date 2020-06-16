var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var connectionController = require('./controller/connectionController');
var profileController = require('./controller/profileController');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({secret: "umesh",resave: false,saveUninitialized: false}));

app.use('/',connectionController);
app.use('/home',connectionController);
app.use('/connections',connectionController);
app.use('/newConnection',connectionController);
app.use('/logout',connectionController);
app.use('/connections/connection/:connectionId',connectionController);
//app.use('/savedconnections',profileController);
app.use('/savedConnections',profileController);
//app.use('/savedConnections/login',profileController);
app.use('/login',profileController);
app.use('/savedConnections/check',profileController);
app.use('/check',profileController);


app.use('/about',connectionController);
app.use('/contact',connectionController);


app.listen(8080);

