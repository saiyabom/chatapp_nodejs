'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (io) {
    io.use(_socketioJwt2.default.authorize({
        secret: _config2.default.secret,
        handshake: true
    }));

    io.on('connection', function (socket) {
        console.log('New user connected');
        //console.log(socket.handshake)
        console.log(socket.decoded_token, 'connected');

        socket.broadcast.emit('newMessage', (0, _utils.generateMessage)('Admin', 'New User join'));

        socket.on('join', function (params, callback) {
            console.log('=========join=========');
            console.log(params);
            if (!(0, _utils.isRealString)(params.from) || !(0, _utils.isRealString)(params.to)) {
                callback('Name and Room are required');
            }
            socket.join(params.to);
            //socket.emit('newMessage',generateMessage('Admin','Welcom to the chat app'))
            //socket.broadcast.to(params.to).emit('newMessage',generateMessage('Admin','New User join'))
            //socket.to(params.room).emit(newMessage,generateMessage('Admin','Welcome to the chat app'))
        });
        socket.on('leave', function (params, callback) {
            if (!(0, _utils.isRealString)(params.name) || !(0, _utils.isRealString)(params.room)) {
                callback('Name and Room are required');
            }
            console.log('======Leave========');

            socket.emit('newMessage', (0, _utils.generateMessage)('Admin', 'Welcom to the chat app'));
            socket.broadcast.to(params.room).emit('newMessage', (0, _utils.generateMessage)('Admin', 'Leave one'));
            socket.leave(params.room);
            //socket.to(params.room).emit(newMessage,generateMessage('Admin','Welcome to the chat app'))
        });
        socket.on('createMessage', function (params, callback) {
            console.log('Create Message: ');
            console.log(JSON.stringify(params));
            var from = params.from,
                to = params.to,
                message = params.message,
                createdAt = params.createdAt;

            socket.broadcast.to(params.to).emit('newMessage', (0, _utils.generateMessageTo)(from, to, message, createdAt));
            callback();
        });
        socket.on('disconnect', function () {
            console.log('User was disconnected');
        });
    });
};

var _utils = require('./utils');

var _socketioJwt = require('socketio-jwt');

var _socketioJwt2 = _interopRequireDefault(_socketioJwt);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }