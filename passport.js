//  https://massivcode.com/9
const commonInfo = require('./routes/util');

const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use(new FacebookStrategy({
            clientID: commonInfo.facebook_clientID,
            clientSecret: commonInfo.facebook_clientSecret,
            profileFields: ['id', 'displayName', 'name', 'email'],
            callbackURL: commonInfo.facebook_callbackURL
        },

        function (accessToken, refreshToken, profile, done) {
            let user = {sns:'f', id: 'f'+profile.id, name: profile.name.familyName+profile.name.givenName, email: profile.emails[0].value}
            onLoginSuccess(user, done);
        }
    ));

    passport.use(new GoogleStrategy({
            clientID: commonInfo.google_clientID,
            clientSecret: commonInfo.google_clientSecret,
            callbackURL: commonInfo.google_callbackURL,
            scope: ["profile", "email"]
        }, function (accessToken, refreshToken, profile, done) {
            let user = {sns:'g', id: 'g' + profile.id, name: profile.displayName, email: profile.emails[0].value}
            console.log(profile)
            onLoginSuccess(user, done);
        }
    ));

    function onLoginSuccess( user, done) {
        //console.log(socialid);
        
        return done(null, user);
    }
};