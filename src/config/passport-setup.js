import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userModel from '../../db/models/user.model.js'
import 'dotenv/config'



passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

passport.deserializeUser(function(id, done) {
userModel.findById({_id:id}).then((user)=>{
    done(null, user);
})
});


passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "https://aegina.onrender.com/auth/google/redirect"
  },


 function(accessToken, refreshToken, profile, cb) {
    // Your callback logic here
    userModel.findOne({ email: profile. _json.email }).select('-password -createdAt -updatedAt -__v -isActive -isBlocked ').then((currentUser) => {
        if (currentUser) {
            // console.log('user is', currentUser);
            cb(null, currentUser); // Call done callback with the user
        } else {
            new userModel({
                name: profile.displayName,
                googleId: profile.id
            }).save().then((newUser) => {
                // console.log("new user created", newUser);
                cb(null, newUser); // Call done callback with the new user
            }).catch(err => {
                console.error("Error creating new user:", err);
                cb(err); // Call done callback with error
            });
        }
    }).catch(err => {
        console.error("Error finding user:", err);
        cb(err); // Call done callback with error
    });
}

));

export default passport;