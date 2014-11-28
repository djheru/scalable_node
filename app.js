var express = require('express')
  , app = express()
  , errorHandlers = require('./middleware/errorhandlers')
  , util = require('./middleware/utilities')
  , routes = require('./routes')
  , log = require('./middleware/log')
  , partials = require('express-partials')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , RedisStore = require('connect-redis')(session)
  , bodyParser = require('body-parser')
  , csrf = require('csurf')
  , flash = require('connect-flash')
  , io = require('./socket.io')
  , config = require('./config');

app.set('view engine', 'ejs');
app.set('view options', {defaultLayout: 'layout'});

app.use(partials());
app.use(express.static(__dirname + '/static'));
app.use(log.logger);
app.use(cookieParser(config.secret))
app.use(session({
  secret: config.secret,
  saveUninitialized: true,
  resave: true,
  store: new RedisStore({
    url: config.redisUrl
  })
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(csrf());
app.use(util.csrf);
app.use(util.authenticated);
app.use(flash());
app.use(util.templateRoutes);

/*
//Inline middleware for example
app.use(function(req, res, next){
  if(req.session.pageCount){
    req.session.pageCount++;
  } else {
    req.session.pageCount = 1;
  }
  next();
})
*/

//Thy routes
app.get('/', routes.index);
app.get(config.routes.login, routes.login);
app.post(config.routes.login, routes.loginProcess);
app.get(config.routes.logout, routes.logOut);
app.get('/chat', [util.requireAuthentication], routes.chat);

app.get('/error', function(req, res, next){
  next(new Error('an error'));
});

app.use(errorHandlers.error);
app.use(errorHandlers.notFound);

var server = app.listen(config.port);
io.startIo(server);
console.log("App server running on port 8000");