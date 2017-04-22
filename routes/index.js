var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get('/',function(req,res){
  res.render('landing');
});
//authentication routes
// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});


router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
          req.flash("success", "Welcome to Food4All " + user.username);
          res.redirect("/foods"); 
        });
    });
});


router.get("/login", function(req, res){
   res.render("login"); 
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/foods",
        failureRedirect: "/login",
        failureFlash: "Password or username are incorrect",
        successFlash: "You logged in!"
    }), function(req, res){
});

router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "You logged out!");
   res.redirect("/foods");
});

module.exports = router;