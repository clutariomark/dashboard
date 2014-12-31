
/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  static = require('serve-static'),
  errorHandler = require('errorhandler'),
  multer = require('multer');
    
var app = module.exports = express();

/**
* Configuration
*/

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(multer());
app.use(bodyParser());
app.use(methodOverride());
app.use(static(path.join(__dirname, 'uploaded_data')));
app.use(static(path.join(__dirname, 'public')));
//app.use(app.router);

// development only
if (app.get('env') === 'development') {
   app.use(errorHandler());
};

// production only
if (app.get('env') === 'production') {
  // TODO
}; 



// Routes
app.get('/', routes.index);
app.get('/partial/:name', routes.partial);

app.get('/api/data/:type', api.data);
app.post('/api/submit/:type', api.submit);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

/**
* Start Server
*/

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});