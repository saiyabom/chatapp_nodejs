'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signup = exports.signin = undefined;

var _jwtSimple = require('jwt-simple');

var _jwtSimple2 = _interopRequireDefault(_jwtSimple);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _cluster = require('cluster');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function tokenForUser(user) {
  var timestamp = new Date().getTime();
  console.log(user);
  var token = _jwtSimple2.default.encode({ sub: user._id, email: user.email, iat: timestamp }, _config2.default.secret);
  console.log('token:', token);
  return token;
}
var signin = exports.signin = function signin(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  console.log('singin function');
  console.log(email);
  console.log(password);

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }
  _user2.default.findOne({ email: email }, function (err, user) {
    if (err || !user) {
      console.log(user);
      return next(err);
    }
    console.log(user);
    console.log('Password:' + password);
    user.comparePassword(password, function (err, isMatch) {
      if (err) console.log(err);
      console.log("isMatch:" + _cluster.isMaster);
      if (isMatch) return res.status(422).send({ error: 'Password Wrong' });
      res.send({ token: tokenForUser(user) });
    });
  });
};

var signup = exports.signup = function signup(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  console.log('signup function');
  console.log(email);
  console.log(password);

  if (!email || !password) {
    console.log('You must provide email and password');
    return res.status(422).send({ error: 'You must provide email and password' });
  }

  // See if a user with the given email exists
  _user2.default.findOne({ email: email }, function (err, existingUser) {
    if (err) {
      return next(err);
    }

    // If a user with email does exist, return an error
    if (existingUser) {
      console.log('Email is in use');
      return res.status(422).send({ error: 'Email is in use' });
    }

    // If a user with email does NOT exist, create and save user record
    console.log('Ready to save');
    var user = new _user2.default({
      email: email,
      password: password
    });

    user.save(function (err) {
      if (err) {
        return next(err);
      }

      // Repond to request indicating the user was created
      res.json({ token: tokenForUser(user) });
    });
  });
};