
var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    mongoose = require('mongoose');

var mongoPassword = '3JNxmvQ&gHHv5$7H';
var port         = process.env.port || 3000;
var index = require('./routes/index.js');
var app = express();


// var mongoDB = "mongodb://127.0.0.1/spotify_test";
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);


// mongoose.connect(mongoDB, function (err) {
//     if (err) {
//         console.log("connection error", err);
//
//     } else {
//         console.log('connection successful!');
//     }
// });
var config = JSON.parse(process.env.APP_CONFIG);
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(
	"mongodb://" + config.mongo.user + ":" + encodeURIComponent(mongoPassword) + "@" +
	config.mongo.hostString,
	function(err, db) {
		if (err) {
        console.log("connection error", err);

    } else {
        console.log('connection successful!');
    }
	}
);


app.set('trust proxy', 1); // trust first proxy

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static(path.join(__dirname, 'public')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    //cookie:{secure:true}
}));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/', index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log('error 404')
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    console.log("error handler")
    // set locals, only providing error in development
    res.locals.message = err.message;
		console.log(err.message)

	res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});






app.listen(port,'0.0.0.0', function(){
  console.log('Now it is listening the port ' + port)
});

module.exports = app;