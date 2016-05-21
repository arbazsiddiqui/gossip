var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var firebase = require('firebase');

firebase.initializeApp({
    databaseURL: "https://chatapp-befed.firebaseio.com",
    serviceAccount: "chatapp-75eb17040c50.json"
});

var db = firebase.database();
var ref = db.ref("chatroom");
var keys=[];
ref.once("value", function(snapshot) {
   for (var key in snapshot.val()){
       keys.push(key)
   }
   loopover(keys);
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

function loopover(keys){
    for (i= 0; i<keys.length; i++){
        roomListener(keys[i]);
    }
}

function roomListener(roomkey){
    var roomref = db.ref("chatroom/" + roomkey);
    roomref.limitToLast(2).on("child_added", function(snapshot){
        //console.log(JSON.stringify(snapshot.key, null, 4));
        if (snapshot.key != "name"){
            changeStatus(roomkey, snapshot.key)
        }

        //console.log("recent added " + snapshot.val());
    });
}

function changeStatus(roomkey, messagekey){
    var messageref = db.ref("chatroom/" + roomkey + "/" + messagekey);
    messageref.update({
        status : "saved in database"
    })
}

module.exports = app;
