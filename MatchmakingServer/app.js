'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var redis = require('redis');
var Redlock = require('redlock');
var util = require("util");
var compression = require('compression');
require('console-stamp')(console, 'HH:MM:ss.l');

var routes = require('./routes/index');
var users = require('./routes/users');
var match = require('./routes/match');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/match', match);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', 1555);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

//  redis
const redisReadWrite = redis.createClient(6379, '127.0.0.1');

redisReadWrite.on('error', function (err) {
    console.log('Error ' + err);
});

const redlock = new Redlock(
    // you should have one client for each independent redis node
    // or cluster
    [redisReadWrite],
    {
        // the expected clock drift; for more details
        // see http://redis.io/topics/distlock
        driftFactor: 0.01, // multiplied by lock ttl to determine drift time

        // the max number of times Redlock will attempt
        // to lock a resource before erroring
        retryCount: 10,

        // the time in ms between attempts
        retryDelay: 200, // time in ms

        // the max time in ms randomly added to retries
        // to improve performance under high contention
        // see https://www.awsarchitectureblog.com/2015/03/backoff.html
        retryJitter: 200 // time in ms
    }
);

redlock.on('clientError', function (err) {
    console.error('A redis error has occurred:', err);
});

global.redis = {};
global.redis.redlock = redlock;
global.redis.getAsync = util.promisify(redisReadWrite.get).bind(redisReadWrite);
global.redis.mgetAsync = util.promisify(redisReadWrite.mget).bind(redisReadWrite);
global.redis.setAsync = util.promisify(redisReadWrite.set).bind(redisReadWrite);
global.redis.setexAsync = util.promisify(redisReadWrite.setex).bind(redisReadWrite);
global.redis.hmsetAsync = util.promisify(redisReadWrite.hmset).bind(redisReadWrite);
global.redis.hgetallAsync = util.promisify(redisReadWrite.hgetall).bind(redisReadWrite);
global.redis.existsAsync = util.promisify(redisReadWrite.exists).bind(redisReadWrite);
global.redis.delAsync = util.promisify(redisReadWrite.del).bind(redisReadWrite);
global.redis.redisMulti = redisReadWrite.multi();   //  공유되는건가..? 그럼 async 작업에서 꼬일수도 있을텐데..
global.redis.execMultiAsync = util.promisify(global.redis.redisMulti.exec).bind(global.redis.redisMulti);
