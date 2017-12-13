'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _socketapp = require('./services/socketapp');

var _socketapp2 = _interopRequireDefault(_socketapp);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _connectMongo = require('connect-mongo');

var _connectMongo2 = _interopRequireDefault(_connectMongo);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Session store feature
var MongoStore = (0, _connectMongo2.default)(_expressSession2.default);

var app = (0, _express2.default)();

// DB Setup
_mongoose2.default.connect('mongodb://root:1qaz2wsx@ds129066.mlab.com:29066/chatbox');

// App Setup
app.use(_express2.default.static('public'));
app.use((0, _morgan2.default)('dev'));
app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json());
app.use((0, _cookieParser2.default)());

//Session
app.use((0, _expressSession2.default)({
    secret: _config2.default.secret,
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
        mongooseConnection: _mongoose2.default.connection,
        ttl: 2 * 24 * 60 * 60
    })
}));

(0, _router2.default)(app);

// Server Setup
var port = process.env.PORT || 3090;
var server = _http2.default.createServer(app);
var io = (0, _socket2.default)(server);
(0, _socketapp2.default)(io);
server.listen(port, function () {
    console.log('Server is up on ' + port);
});
console.log('Server listening on:', port);