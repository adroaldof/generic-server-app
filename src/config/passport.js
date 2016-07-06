import passport from 'passport';
import mongoose from 'mongoose';

import localStrategy from './strategies/local';


const User = mongoose.model('User');

function init () {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, done);
    });

    // Load strategies
    localStrategy();
}

export default init;
