'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userSchema = new _mongoose.Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String,
    roomList: [String]
});

userSchema.pre('save', function (next) {
    console.log(this);
    var user = this;

    _bcryptNodejs2.default.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }

        _bcryptNodejs2.default.hash(user.password, salt, null, function (err, hash) {
            if (err) {
                return next(err);
            }

            user.password = hash;
            next();
        });
    });
});
userSchema.methods.comparePassword = function (candidatePassword, callback) {
    console.log(this);
    _bcryptNodejs2.default.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            return callback(err);
        }

        callback(null, isMatch);
    });
};

exports.default = _mongoose2.default.model('user', userSchema);