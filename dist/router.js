'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (app) {
  app.get('/', requireAuth, function (req, res) {
    console.log(req.user);
    res.send({ message: 'Super secret code is ABC123' });
  });
  app.post('/signin', _authentication.signin);
  app.post('/signup', _authentication.signup);
  app.post('/addroom', requireAuth, addRoom);
};

var _authentication = require('./controller/authentication');

var _passport = require('./services/passport');

var _passport2 = _interopRequireDefault(_passport);

var _user = require('./models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requireAuth = _passport2.default.authenticate('jwt', { session: false });
var requireSignin = _passport2.default.authenticate('local', { session: false });

var addRoom = function addRoom(req, res) {
  var roomName = req.body.to;
  if (!roomName) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }
  console.log(req.user);
  _user2.default.findOne({ email: req.user.email }, function (err, user) {
    if (err || !user) {
      console.log(user);
      return next(err);
    }

    user.roomList.push(roomName);
    if (user.roomList.length > 4) user.roomList.shift();
    user.save(function (err) {
      if (err) {
        return next(err);
      }

      // Repond to request indicating the user was created
      res.json({ result: 'success' });
    });
  });
};