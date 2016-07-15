// import passport from 'passport';
import LocalStrategy from 'passport-local';


// const User = mongoose.model('User');
import User from '../../api/users/users.model';

function localStrategy (passport) {
    const strategyParams = {
        usernameField: 'email',
        passwordField: 'password'
    };

    // TODO: findout a way to test this
    /* istanbul ignore next */
    passport.use('local', new LocalStrategy(strategyParams, (email, password, done) => {
        User.authenticate(email, password, (err, user) => {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, {
                    message: 'Invalid email or password'
                });
            }

            return done(null, user);
        });
    }));
}

export default localStrategy;
