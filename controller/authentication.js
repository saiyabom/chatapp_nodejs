import jwt from 'jwt-simple'

import User from '../models/user'
import config from '../config'
import { isMaster } from 'cluster';

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    console.log(user)
    const token = jwt.encode({ sub: user._id, email:user.email,iat: timestamp }, config.secret);
    console.log('token:',token)
    return token
}
export const signin = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  console.log('singin function')
  console.log(email)
  console.log(password)

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password'});
  }
  User.findOne({ email: email }, (err, user)=>{
    if (err || !user) { 
      console.log(user)
      return next(err); }
    console.log(user)
    console.log('Password:'+password)
    user.comparePassword(password,function(err,isMatch){
      if(err) console.log(err)
      console.log("isMatch:"+ isMaster)
      if(isMatch) return res.status(422).send({ error: 'Password Wrong'});
      res.send({ token: tokenForUser(user) });
      
    })
    
  });


    
}

export const signup = function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    console.log('signup function')
    console.log(email)
    console.log(password)
  
    if (!email || !password) {
      console.log('You must provide email and password')
      return res.status(422).send({ error: 'You must provide email and password'});
    }
  
    // See if a user with the given email exists
    User.findOne({ email: email }, (err, existingUser)=>{
      if (err) { return next(err); }
  
      // If a user with email does exist, return an error
      if (existingUser) {
        console.log('Email is in use')
        return res.status(422).send({ error: 'Email is in use' });
      }
  
      // If a user with email does NOT exist, create and save user record
      console.log('Ready to save')
      const user = new User({
        email: email,
        password: password
      });
  
      user.save((err)=>{
        if (err) { return next(err); }
  
        // Repond to request indicating the user was created
        res.json({ token: tokenForUser(user) });
      });
    });
  }