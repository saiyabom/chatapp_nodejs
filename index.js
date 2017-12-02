

import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import morgan from 'morgan'

const app = express()

import router from './router'
import mongoose from 'mongoose'
import cors from 'cors'



// DB Setup
mongoose.connect('mongodb://root:1qaz2wsx@ds129066.mlab.com:29066/chatbox');

// App Setup
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({type:"*/*"}));
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);