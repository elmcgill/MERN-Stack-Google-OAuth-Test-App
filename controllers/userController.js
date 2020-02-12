const JWT = require('jsonwebtoken');
const User = require('../models/userModel');
const { JWT_SECRET} = require('../config');

signToken = user => {

    return JWT.sign({
        iss: 'authApp',
        sub: user.id,
        iat: new Date().getTime(), //current date
        exp: new Date().setDate(new Date().getDate() + 1) //exactly one day later
    }, JWT_SECRET);

}

module.exports = {

    //Email and password
    signUp: async(req, res, next) => {
        
        const email = req.value.body.email;
        const password = req.value.body.password;
        //Check if there is a user with the same email
        const foundUser = await User.findOne({"local.email": email});
        if(foundUser){
            return res.status(403).send({error: 'Email already exists'});
        }

        //If no user exists create new
        const newUser = new User({
            method: 'local',
            local: {
                email: email,
                password: password
            }
        });

        await newUser.save();

        //Generate the token
        const token = signToken(newUser);

        //Respone with token
        res.status(200).json({token: token});
    },

    login: async(req, res, next) => {
        //Generate token
        const token = signToken(req.user);
        res.status(200).json({ token });
    },

    googleOAuth: async (req, res, next) => {
        //Gnerate token
        console.log('reg.user', req.user);
        const token = signToken(req.user);
        res.status(200).json({token});
    },

    secret: async(req, res, next) => {
        console.log('We got into the secret path');
        res.json({secret: "embarassing photo of spongebob at the christmas party"});
    }
}