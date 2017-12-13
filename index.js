

import express from 'express'
import socketIO from 'socket.io'
import http from 'http'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import socketApp from './services/socketapp'
import config from './config'

//Session store feature
import session from 'express-session'
import ConnectMongo from 'connect-mongo'
const MongoStore = ConnectMongo(session);


const app = express()

import router from './router'
import mongoose from 'mongoose'
import cors from 'cors'





// DB Setup
mongoose.connect('mongodb://root:1qaz2wsx@ds129066.mlab.com:29066/chatbox');

// App Setup
app.use(express.static('public'))
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser())

//Session
app.use(session({
    secret:config.secret,
    saveUninitialized:true,
    resave:true,
    store: new MongoStore({
        mongooseConnection:mongoose.connection,
        ttl: 2 * 24 * 60 * 60,
    })
}))

router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
const io = socketIO(server);
socketApp(io);
server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});
console.log('Server listening on:', port);