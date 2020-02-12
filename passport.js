const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token')
const User = require('./models/userModel');

const {JWT_SECRET} = require('./config');

//Json web tokens strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) =>{
    try{
        //Find the users specified in token
        const user = await User.findById(payload.sub);
        //If user doesnt exist handle it
        if(!user){
            return done(null, false);
        }
        //Otherwise return the user
        done(null, user);
        
    } catch(error){
        done(error, false);
    }
}));

//Google Strategy
passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: '',
    clientSecret: ''
}, async (accessToken, refreshToken, profile, done) => {
    try{
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        console.log('profile', profile);
        //Check if the user exists in the database
        const existingUser = await User.findOne({"google.id": profile.id});
        if(existingUser){
            console.log('User already exists in our database');
            return done(null, existingUser);
        }

        console.log('User doesnt exists in our database, we are creating a new one');
        //If new account
        const newUser = new User({
            method: 'google',
            google: {
                id: profile.id,
                email: profile.emails[0].value
            }
        });
        await newUser.save();
        done(null, newUser);
    } catch(error){
        done(error, false, error.message);
    }
}));

//Local strategy
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try{
        //Find the user given the email
        const user = await User.findOne({"local.email" : email});
        //If not handle it
        if(!user){
            return done(null, false);
        }
        //Check if the password is correct
        const isMatch = await user.isValidPassword(password);
        //If not handle it
        if(!isMatch){
            return done(null, false);
        }
        //Otherwise return the user
        done(null, user);

    } catch(error){
        done(error, false);
    }
}));