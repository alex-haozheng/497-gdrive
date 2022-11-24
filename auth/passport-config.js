const LocalStrategy = require('passport-local').Strategy;
import { createHmac } from 'crypto';
import { builtinModules } from 'module';

function initialize(passport) {
    function authenticateUser(username, password, done) {
        const user = getUserByUsername(username);
        if (!user) return done(null, false, { message: 'Username DNE' });
        try {
            if (password === user.password) return done(null, user);
            else return done(null, false, { message: 'Incorrect PW' });
        } catch(e) {
            return done(e);
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'username' }), authenticateUser);
    passport.serializeUser((user, done) => {});
    passport.deserializeUser((id, done) => {});
}

module.exports = initialize;