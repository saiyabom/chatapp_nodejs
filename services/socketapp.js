
import {generateMessage, isRealString,generateMessageTo} from './utils'
import socketioJwt from 'socketio-jwt'
import config from '../config'

export default function(io){
    io.use(socketioJwt.authorize({
        secret: config.secret,
        handshake: true
      }));
      
    io.on('connection', (socket) => {
        console.log('New user connected');
        //console.log(socket.handshake)
        console.log(socket.decoded_token, 'connected');
        
        socket.broadcast.emit('newMessage', generateMessage('Admin','New User join'))
    
        socket.on('join',(params,callback)=>{
            console.log('=========join=========')
            console.log(params)
            if(!isRealString(params.from)|| !isRealString(params.to)){
                callback('Name and Room are required')
    
            }
            socket.join(params.to)
            //socket.emit('newMessage',generateMessage('Admin','Welcom to the chat app'))
            //socket.broadcast.to(params.to).emit('newMessage',generateMessage('Admin','New User join'))
            //socket.to(params.room).emit(newMessage,generateMessage('Admin','Welcome to the chat app'))
    
        })
        socket.on('leave',(params,callback)=>{
            if(!isRealString(params.name)|| !isRealString(params.room)){
                callback('Name and Room are required')
    
            }
            console.log('======Leave========')
            
            socket.emit('newMessage',generateMessage('Admin','Welcom to the chat app'))
            socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin','Leave one'))
            socket.leave(params.room)
            //socket.to(params.room).emit(newMessage,generateMessage('Admin','Welcome to the chat app'))
    
        })
        socket.on('createMessage',(params,callback)=>{
            console.log('Create Message: ')
            console.log(JSON.stringify(params));
            const {from, to, message, createdAt} = params
            socket.broadcast.to(params.to).emit('newMessage',generateMessageTo(from,to,message,createdAt))
            callback();
        })
        socket.on('disconnect', () => {
            console.log('User was disconnected');
        });
    });
}
