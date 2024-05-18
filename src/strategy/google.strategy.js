// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// passport.use(new GoogleStrategy({
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.REDIRECT_URL,
//       passReqToCallback: true,
//       scope: ['profile', 'email']
// },
//       (accessToken, refreshToken, profile, done) => {
//             console.log(profile);
//             //  Extract the email and name from the profile and Construct the user object
//             const user = {
//                   email: profile.emails[0].value,
//                   name: profile.displayName,
//                   accessToken: accessToken,
//             };
//             return done(null, user);
//       }
// ));

// module.exports = passport;
