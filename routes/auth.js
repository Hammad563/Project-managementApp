const express = require('express');
const passport = require('passport');
const passportUtils = require('../auth/passportUtils');
const router = express.Router();
const taskDB = require('../DB/taskDb');


// register Request
router.post("/register", async (req,res) => {
    const duplicateEmail = await taskDB.getUserByEmail(req.body.userEmail);
    if(!duplicateEmail){
        const saltHash = passportUtils.generatePassword(req.body.userPassword);
        const salt = saltHash.salt;
        const hash = saltHash.hash;
        taskDB.saveNewUser({
            fullname: req.body.userFullName,
            institution: req.body.userInst,
            job: req.body.userJob,
            location: req.body.userLocation,
            username: req.body.userEmail,
            hash: hash,
            salt: salt,
            
        });
        res.send({registered: true})
    }else{
        res.send({registered: false});
    }
});

// login request
router.post("/login", function(req,res,next) {
    passport.authenticate("local", function (err, user){
        if(err){
            return next(err);
        }
        if(!user){
            return res.send({loginStatus: false});
        }
        req.logIn(user, function(err){
            if(err){
                return next(err)
            }
            return res.send({loginStatus: user.username})
        });
    })(req,res,next);
})

router.get("/isLoggedIn", (req,res) => {
    const isLoggedIn = req.isAuthenticated();
    res.send({
        isLoggedIn: isLoggedIn,
        user: req.user
    })
})

router.get("/logout", (req,res) => {
    req.logOut();
    res.send({logOut: true});
})



module.exports = router;