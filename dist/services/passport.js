'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportJwt = require('passport-jwt');

var _passportLocal = require('passport-local');

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _cluster = require('cluster');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var localOptions = { usernameFiled: 'email' };
var localLogin = new _passportLocal2.default(localOptions, function (email, password, done) {

    //**** */
    _user2.default.findOne({ email: email }, function (err, user) {
        if (err) return done(err);
        if (!user) return done(null, false);

        user.comparePassword(password, function (err, isMatch) {
            if (err) return done(err);
            if (!isMatch) return done(null, false);

            return done(null, user);
        });
    });
});

// Setup options for JWT Strategy
var jwtOptions = {
    jwtFromRequest: _passportJwt.ExtractJwt.fromHeader('authorization'),
    secretOrKey: _config2.default.secret
};

// Create JWT strategy
var jwtLogin = new _passportJwt.Strategy(jwtOptions, function (payload, done) {

    _user2.default.findById(payload.sub, function (err, user) {
        if (err) {
            return done(err, false);
        }

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

// Tell passport to use this strategy
_passport2.default.use(jwtLogin);
_passport2.default.use(localLogin);

exports.default = _passport2.default;