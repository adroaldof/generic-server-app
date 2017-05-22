import passport from 'passport';
import knex from 'knex';

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser((id, done) => {
  return knex('users')
    .where({ id })
    .firt()
    .then(user => done(null, user))
    .catch(err => done(err, null));
});

export default passport;

