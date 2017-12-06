

import {signin, signup} from './controller/authentication'
import passport from './services/passport'


const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

export default function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ message: 'Super secret code is ABC123' });
  });
  app.post('/signin', signin);
  app.post('/signup', signup);
}
