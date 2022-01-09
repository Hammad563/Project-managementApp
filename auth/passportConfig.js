const passport = require('passport');
const localStrategy = require("passport-local").Strategy;
const taskDb = require('../DB/taskDb');
const passportUtils = require('./passportUtils');

const customFields = {
    usernameField: "userEmail",
    passwordField: "userPassword"
}

const verifyCallBack = async(username,password,done) => {
    const user = await taskDb.getUserByEmail(username);
    if(!user){
        return done(null, false);
    }

    const isValid = passportUtils.validatePassword(password, user.hash, user.salt)

    if(isValid){
        return done(null, user);
    }else{
        return done(null, false);
    }

}


// main function
const strategy = new localStrategy(customFields, verifyCallBack);
passport.use(strategy);


// serialize and deserialize 

passport.serializeUser( (user, done) => {
    done(null, user._id);
})

passport.deserializeUser( async (userId, done) => {
    const user = await taskDb.getUserById(userId);
    if(user){
        done(null, user);
    }
})