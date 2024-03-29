var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('config');
var proxy = require('express-http-proxy');

var sassMiddleware = require('node-sass-middleware');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

// session middleware
var sessionMiddleware = session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
});

app.use(sessionMiddleware);

// sccs prepocessor middleware
app.use(sassMiddleware({
    src: __dirname + config.get('sass.src'),
    dest: __dirname + config.get('sass.dest'),
    debug: true,
    indentedSyntax: true,
    outputStyle: 'compressed'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

for (const path in config.get("proxies")) {
    const port = config.get(`proxies.${path}.port`);
    console.log(`/${path}`, `localhost:${port}`);

    app.use(`/${path}`, proxy(`localhost:${port}`));
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;