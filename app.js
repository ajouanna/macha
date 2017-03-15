var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('cookie-session'); // Charge le middleware de sessions

// chargement de routeurs spécifiques à chaque route
var index = require('./routes/index');
var users = require('./routes/users');
var todo = require('./routes/todo');
var tchat = require('./routes/tchat');

var app = express();
var port = process.env.port || 8080;
var ent = require('ent');
var fs = require('fs');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

/* On utilise les sessions */
app.use(session({secret: 'machasecret'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// use the favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// use logger in dev mode
app.use(logger('dev'));

// all static files are in public directory
app.use(express.static(path.join(__dirname, 'public')));


// interactions avec les clients via la librairie socket.io
io.sockets.on('connection', function (socket, pseudo) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    }); 

    socket.on('disconnect', function(){
        pseudo = socket.pseudo;
        socket.broadcast.emit('deconnexion_client', pseudo);
	});
	// un client a fait une mise a jour de la todo list => propager l'info
	socket.on('todo_update_vers_serveur', function(){
        socket.broadcast.emit('todo_update_vers_clients');
  });
});


app.use('/', index); 
app.use('/users', users);
app.use('/todo', todo);
app.use('/tchat', tchat);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
// app.listen(port, function() {
// pour utiliser socket.io, je dois faire appel a server et non a app. Je ne comprends pas encore bien pourquoi...
server.listen(port, function() {
    console.log('Server listening on port: ', port);
});