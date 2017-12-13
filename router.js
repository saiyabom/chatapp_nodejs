

import {signin, signup} from './controller/authentication'
import passport from './services/passport'
import User from './models/user'


const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

export default function(app) {
  app.get('/', requireAuth, function(req, res) {
    console.log(req.user)
    res.send({ message: 'Super secret code is ABC123' });

  });
  app.post('/signin', signin);
  app.post('/signup', signup);
  app.post('/addroom',requireAuth, addRoom);
}
const addRoom=(req,res)=>{
  const roomName = req.body.to;
  if (!roomName) {
    return res.status(422).send({ error: 'You must provide email and password'});
  }
  console.log(req.user)
  User.findOne({ email: req.user.email }, (err, user)=>{
    if (err || !user) { 
      console.log(user)
      return next(err); 
    }
    
    user.roomList.push(roomName);
    if(user.roomList.length >4) user.roomList.shift()
    user.save((err)=>{
      if (err) { return next(err); }

      // Repond to request indicating the user was created
      res.json({ result: 'success' });
    });
  
    
  });
}
