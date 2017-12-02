

import passport from 'passport'
import {Strategy as JwtStrategy} from 'passport-jwt'
import {ExtractJwt} from 'passport-jwt' 
import LocalStrategy from 'passport-local'

import User from '../models/user'
import config from '../config'
import { isMaster } from 'cluster';


const localOptions = { usernameFiled: 'email'}
const localLogin = new LocalStrategy(localOptions, (email, password, done)=>{
    
    //**** */
    User.findOne({email},(err, user)=>{
        if(err) return done(err);
        if(!user) return done(null,false);
    
        user.comparePassword(password, (err, isMatch)=>{
            if(err) return done(err)
            if(!isMatch) return done(null, false)
    
            return done(null, user);
        })
    })
})

// Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done)=>{
 
    User.findById(payload.sub, (err, user)=>{
      if (err) { return done(err, false); }
  
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  });
  
  // Tell passport to use this strategy
  passport.use(jwtLogin);
  passport.use(localLogin);

  export default passport;