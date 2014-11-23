var express = require('express')
  , app = express()
  , errorHandlers = require('./middleware/errorhandlers')
  , routes = require('./routes')
  , log = require('./middleware/log')
  , partials = require('express-partials')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , RedisStore = require('connect-redis')(session)
  , bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.set('view options', {defaultLayout: 'layout'});

app.use(partials());
app.use(express.static(__dirname + '/static'));
app.use(log.logger);
app.use(cookieParser('k3yb0ardca7m3ow'))
app.use(session({
  secret: 'k3yb0ardca7m3ow',
  saveUninitialized: true,
  resave: true,
  store: new RedisStore()
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

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

app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/account/login', routes.login)
app.post('/login', routes.loginProcess);
app.get('/chat', routes.chat);

app.get('/error', function(req, res, next){
  next(new Error('an error'));
});

app.use(errorHandlers.error);
app.use(errorHandlers.notFound);

app.listen(8000);
console.log("App server running on port 8000");